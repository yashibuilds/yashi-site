I wrote this article under the assumption that the reader has basic inference knowledge but maybe with some conceptual gaps. It is my goal, not to teach you inference from scratch (Philip Kiely is much better at this), but rather to make each step of inference more intuitive.

\*\*\* Before the pedants come flocking, I occasionally refer to SmolLM2-135M as SmolLM2 in this blog for brevity.

---

## Step 0: Explore SmolLM2-135M

As the honorable Abraham Lincoln ( “Honest Abe”), esteemed 16th President of the United States, preserver of the Union, and author of the Emancipation Proclamation once said: “To optimize your generative AI model’s performance in production, you must first understand it.”

Heeding his advice, we shall begin our journey by exploring SmolLM2-135M’s config.

```python
model.config
```

```
LlamaConfig {
  "architectures": [
    "LlamaForCausalLM"
  ],
  "attention_bias": false,
  "attention_dropout": 0.0,
  "bos_token_id": 0,
  "dtype": "float32",
  "eos_token_id": 0,
  "head_dim": 64,
  "hidden_act": "silu",
  "hidden_size": 576,
  "initializer_range": 0.041666666666666664,
  "intermediate_size": 1536,
  "is_llama_config": true,
  "max_position_embeddings": 8192,
  "mlp_bias": false,
  "model_type": "llama",
  "num_attention_heads": 9,
  "num_hidden_layers": 30,
  "num_key_value_heads": 3,
  "pad_token_id": null,
  "pretraining_tp": 1,
  "rms_norm_eps": 1e-05,
  "rope_interleaved": false,
  "rope_parameters": {
    "rope_theta": 100000,
    "rope_type": "default"
  },
  "tie_word_embeddings": true,
  "transformers_version": "5.18.0",
  "use_cache": true,
  "vocab_size": 49152
}
```

Some useful things to note:

- SmolLM2-135M has roughly 135M parameters. When loaded in FP32, each parameter is stored in 4 bytes, so the parameters alone occupy roughly 540MB of GPU VRAM. Total VRAM usage is higher because of intermediate tensors, the KV cache, and other overhead.
    - The published configuration for SmolLM2-135M specifies BF16 (similar to FP16 but the individual bits are assigned differently). I chose to load the parameters as FP32 instead to decrease additional rounding errors in later calculations (converting BF16 weights to FP32 does not recover precision already lost in the stored weights). The obvious downside to loading each parameter with twice as many bits is using twice as much memory, but for the purpose of this blog, sacrificing memory for precision is worth it (and also illustrative of the precision-memory tradeoff inference engineers typically face).
- SmolLM2-135M’s vocabulary is nearly 50,000 tokens long.
- Each token’s embedding vector has 576 features. SmolLM2-135M uses 9 query attention heads with 64 features per head (9 * 64 = 576). Interestingly, there are only 3 key heads and 3 value heads, paired into 3 key-value heads. Each key-value head is shared by 3 query heads. We will understand why this discrepancy exists shortly.
- The model has 30 hidden layers (transformer blocks) and uses SiLU as its activation function within each transformer block’s feedforward network.
- SmolLM2-135M uses causal attention, meaning each token’s representation can incorporate information only from itself and previous tokens. This representation is then used to predict the next token.

---

## Step 1: Tokenization

Now that we understand our model a little better, it’s time to actually give it some text!

I’m a huge self-proclaimed cinephile and my favorite movies are thrillers with plot twist endings. I’m curious to know what SmolLM2 thinks the greatest movie plot twist of all time is (it’s obviously The Prestige by Christopher Nolan).

To get our answer, we need to first call the model’s tokenizer to split up the input and give us each chunk’s token id.

```python
input_string = "The movie with the greatest plot twist ever is"
token_ids = tokenizer(input_string, return_tensors="pt")["input_ids"]
print(token_ids)
print(token_ids.shape)
```

```
tensor([[  504,  7704,   351,   260,  6250,  5049, 10258,  2042,   314]])
torch.Size([1, 9])
```

Note that token ids carry no semantic meaning whatsoever. They are purely positional information about where that token falls in the model’s vocab, so “cat” and “Cat” do not necessarily have similar token ids. The token ids corresponding to our input sequence are stored in a 2D tensor (matrix) with dimension 1 x 9. We generalize the dimensionality of a token id tensor to B x T, where:

B = batch size

T = \# of tokens in the batches’ input sequences

Batch size refers to the number of prompts the model processes at once. When you ask ChatGPT a question, it is highly unlikely you are the only person in the world asking it a question at that time. Often, production models must process several prompts at once. Tensors must be rectangular with the same number of columns, so the logical question that follows is, “What if batches have different sized inputs?” This introduces the concept of padding, which I’ve written a small blurb about in the TLDR Appendix. In this experiment, we only process one batch for simplicity.

---

## Step 2: Prefill

When you prompt a model, it needs to process your input so it can generate a response. Prefill is the process that looks up the embeddings for our 9 input tokens, passes those embeddings through all 30 transformer blocks, stores each layer’s keys and values in the KV cache, and computes the logits used to predict the first output token. Prefill is followed by decode, the step that generates subsequent tokens one at a time, reusing the cached keys and values from previous tokens.

### 2a. Embedding

Next, we need to retrieve the embedding vector for each token from the input. First, we get the model’s embedding table which stores the embedding vector for every token in its vocabulary. Thus, the table should be vocab size x # of features, or 49,152 x 576.

```python
# The embedding table's shape is 49,152 x 576:
embedding_table = model.model.embed_tokens.weight.data
```

Then, we grab specifically our input token ids’ corresponding embedding vectors only.

## TLDR Appendix

As I was building this inference engine, I found myself constantly asking questions about concepts that were tangentially related. I’ve included this section to indulge my curiosities succinctly and help me (and hopefully you as well) sleep better at night. Hopefully I’ll expand upon some of these and turn them into future blog posts!

1. How is a model’s vocabulary generated?
2. How do tokenizers work?
3. What does a model do when its batches inevitably have a different number of tokens?
