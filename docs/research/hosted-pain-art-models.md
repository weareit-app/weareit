# Hosted image models for on-style pain art

Research for [#30](https://github.com/weareit-app/weareit/issues/30) (map: [#28](https://github.com/weareit-app/weareit/issues/28)). Checked 2026-10-19 against provider docs, pricing pages and terms. Prices change often; re-check the linked page before a large run.

**Question.** For a launch fallback, which hosted image models can take the group drawings in `apps/app/assets/brand/drawings/` as style references and draw new subjects in that style? For each: how references go in, how well the style holds, cost per image, rate limits, whether output terms allow a CC0 release, and whether the provider trains on uploads.

**Target style.** The 21 group drawings are flat black ink on white: bold, chunky filled shapes, rounded ends, thick even outlines, a light speckle texture inside large fills, simple dot-and-curve faces. No grey, no gradients. That is easy for a model to approximate and easy for `tools/icon-trace/` to trace, but the "chunky and warm, not too minimal" balance is what drifts.

## Short answer: bake-off list

| Rank | Model (where) | How references go in | Cost per 1024px image | Terms flags |
| --- | --- | --- | --- | --- |
| 1 | **OpenAI GPT Image 2** (`/v1/images/edits` or Responses API) | Several reference files in `image` | Low $0.006, **medium $0.053**, high $0.211, plus a small image-input charge for the references | You own output; no training on API data by default; 20 images/min on the first tier |
| 2 | **FLUX 3 Image edit** (fal, or BFL direct) | `image_urls`, 1 to 10 references | **$0.048**, flat whatever the number of references | You own output; BFL's general terms let it train on inputs unless you opt out; no using output to train other models; do not strip Content Credentials |
| 3 | **Recraft V4 Styles** with a custom style | Create a style from up to 10 images, then pass `style_id` | **$0.035 raster, $0.05 vector**, plus $0.005 once to create the style | You own output on the API; no training on API assets; but no using output to train any model, no removing metadata, and a 30-day local cache limit |
| 4 | **Gemini Nano Banana Pro** (`gemini-3-pro-image`) | Up to 3 style reference images (plus up to 6 object images) | **$0.134** (1K/2K); $0.067 batch | Google claims no ownership; paid tier not used to improve products; every image carries a SynthID watermark |
| 5 | **Ideogram 3.0** with `style_reference_images` | Multipart style reference files | $0.03 Turbo, $0.06 Default, $0.09 Quality (could not confirm live) | You own output; no training on API input or output; API terms ask for "Powered by Ideogram" attribution in developer apps |

Not worth a slot: **FLUX.1 Kontext pro** ($0.04 on fal) takes one input image and is built to edit that image, not to draw a new subject in its style; FLUX 3 replaces it. **FLUX.2 pro edit** (fal: $0.03 for the first output megapixel plus $0.015 per extra input or output megapixel, up to 9 references) is a cheaper FLUX fallback if FLUX 3 underperforms.

A bake-off of 5 pains × 2 tries × these 5 models at medium quality costs roughly **$3**, inside the map's "a few dollars".

Why this order:

- **GPT Image 2 first.** The anchor drawings look like GPT-image output already (rounded chunky ink, speckle in the fills), so it is the most likely to match without tuning. Multiple references go into one edit call. OpenAI's own guide warns it "may occasionally struggle to maintain visual consistency" for recurring brand elements across many generations, so the bake-off has to test drift over a set, not one image.
- **FLUX 3 second.** Ten references at a flat price is the best reference budget of any option, and the same model family has an open-weights sibling (FLUX 3 Klein) that runs locally on an 8 GB GPU, which keeps a path to the local-first plan. Its terms are the weakest on training (see below).
- **Recraft third, but it is the only one built for this.** A saved custom style is exactly "hold a reference style across many subjects", and it can output SVG directly. It drops to third because its terms are the most restrictive for It's plans (no training any model on output, 30-day cache clause), and Recraft's styles tend toward clean vector graphics rather than ink texture.
- **Nano Banana Pro fourth.** It is the only model here that names a "style reference" input, but costs about 2.5 times GPT Image 2 medium.
- **Ideogram fifth.** Cheap and clean terms, but its strength is typography and the live price page did not load for verification.

## Per-provider detail

### OpenAI GPT Image 2 (and 1.5, 1-mini)

- **References.** The Image API edit call accepts several files in `image` (the guide's example uses four). The Responses API takes input images as URL, Base64 or file ID, and supports multi-turn refinement via `previous_response_id`. A mask applies to the first image only. [Image generation guide](https://developers.openai.com/api/docs/guides/image-generation)
- **Cost per image (1024×1024).** GPT Image 2: low $0.006, medium $0.053, high $0.211. GPT Image 1.5: $0.009 / $0.034 / $0.133. GPT Image 1 Mini: $0.005 / $0.011 / $0.036. Reference images are billed as image input tokens: $8 per million for GPT Image 2 ($2.50 for Mini). Batch halves every rate. [Guide cost table](https://developers.openai.com/api/docs/guides/image-generation), [pricing](https://developers.openai.com/api/docs/pricing)
- **Newer models.** `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare` are listed at the same token rates as GPT Image 2 and add `xhigh` and `max` quality. Worth one row in the bake-off if GPT Image 2 is close but not right. [Pricing](https://developers.openai.com/api/docs/pricing)
- **Transparent background.** Supported (`background: "transparent"` with PNG or WebP). Useful for tracing. [Guide](https://developers.openai.com/api/docs/guides/image-generation)
- **Rate limits (GPT Image 2).** Build tier 20 images per minute, Launch 150, Grow 250. [Model page](https://developers.openai.com/api/docs/models/gpt-image-2)
- **Training on uploads.** "data sent to the OpenAI API is not used to train or improve OpenAI models" unless you opt in. Abuse-monitoring logs are kept up to 30 days. Image generation with these models is Zero Data Retention compatible. [Your data](https://developers.openai.com/api/docs/guides/your-data)
- **Output terms.** The Services Agreement says the customer owns output and OpenAI assigns any rights it has in it; there is a restriction on using output to build competing models. The openai.com page blocked automated reading, so this is from search snippets of [the agreement](https://openai.com/policies/services-agreement/) rather than a full read. Read it once before relying on it.

### FLUX 3 Image edit (Black Forest Labs, via fal)

- **References.** `image_urls`, 1 to 10 URLs, each at least 256 px per side and at most 4 MP; the prompt can refer to "image 1", "image 2" in order. [fal model page](https://fal.ai/models/blackforestlabs/flux-3/edit-image); BFL says FLUX 3 can "combine up to ten references". [BFL FLUX 3 overview](https://docs.bfl.ai/flux_3/flux3_image_overview)
- **Cost.** $0.048 for a 1K (1 MP) image, "one flat price per image, whatever the number of references". [fal](https://fal.ai/models/blackforestlabs/flux-3/edit-image)
- **Cheaper sibling.** FLUX 3 Klein edit: planned $0.009 at 1K, $0.008 at 768², also up to ten references. [fal Klein edit](https://fal.ai/models/blackforestlabs/flux-3/klein/edit-image), [BFL pricing](https://docs.bfl.ai/quick_start/pricing). Its weights are open under the FLUX Kommunity License, free for commercial use under $5M annual revenue, and the INT8 build "runs on NVIDIA GeForce RTX GPUs with as little as 8GB of VRAM". That matches the founder's RTX 3070. [BFL blog](https://bfl.ai/blog/flux-3-image-klein)
- **Rate limits.** Not found for fal or BFL.
- **Training on uploads.** BFL's general terms grant BFL a license to "provide, develop, train and improve" its services using your content, with opt-out by emailing legal@blackforestlabs.ai (§1.2(e)). [BFL terms](https://bfl.ai/legal/terms-of-service). BFL's developer terms do not say either way and point to the privacy policy. [BFL developer terms](https://bfl.ai/legal/developer-terms-of-service). fal's terms let it use "Usage Data", which may be derived from customer input, to develop its products and AI models (§6(c)), and say third-party models "may be subject to additional terms" (§14(b)). [fal terms](https://www.fal.ai/legal/terms-of-service)
- **Output terms.** "you own all right, title, and interest in and to Output" (BFL developer terms §3(b)). Restrictions: no using output "to train, distill or fine tune any other AI models" (§6(c)); do not remove Content Credentials (§6(i)). fal claims no IP in output (§4(b)).

### Recraft V4 Styles with a custom style

- **References.** `create style` takes up to 10 PNG, JPG or WebP images (20 MB each, 64 MB total) and returns a style; generation then takes `style_id`. V4 Styles models require a style. `match` can be `flexible` (default) or `precise`. Works on every model except V4.1 Flash. [Endpoints](https://www.recraft.ai/docs/api-reference/endpoints)
- **Cost.** V4 Styles: $0.035 raster, $0.05 vector; pro raster $0.10. Creating a style: $0.005. Passing style references inline instead of a saved style creates one each call (+$0.005). Vectorizing a raster: $0.01. [Pricing](https://www.recraft.ai/docs/api-reference/pricing)
- **Rate limits.** "As published in the Documentation"; no figures found.
- **Training on uploads.** For the API: Recraft "will not use any Assets created using the API Services to train Recraft AI models" (§6.3). The web app trains on inputs by default unless you opt out (Terms §7.7). [Developer terms](https://www.recraft.ai/legal/developer-terms), [Terms](https://www.recraft.ai/terms)
- **Output terms.** "You own all Assets you create with the API Services" (§6.2). Flags:
  - Assets "may not be used to train any artificial intelligence model" (§6.2). This conflicts with the map's long-term LoRA option if the LoRA is trained on Recraft-made art.
  - Caching Assets locally is allowed "for a period not to exceed thirty (30) days", and no "persistent database of content" (§3.6). This sits awkwardly next to §6.2 ownership; ask Recraft how it applies to assets the customer owns before choosing it.
  - Do not remove Recraft's machine-readable metadata (§6.4).
  - The free web plan is unusable: Recraft owns free-tier assets (Terms §7.1).

### Gemini Nano Banana Pro and Nano Banana 2 / 2.1

- **References.** Up to 14 reference images in total across the family. Nano Banana Pro: up to 6 object images and **3 style reference images**. Nano Banana 2 and 2.1: up to 10 object and 5 character images, no style slot named. [Image generation docs](https://ai.google.dev/gemini-api/docs/image-generation)
- **Cost per image.** Nano Banana Pro $0.134 at 1K/2K ($0.067 batch). Nano Banana 2 $0.067 at 1K. Nano Banana 2.1 $0.0336 at 1K. Gemini 2.5 Flash Image shut down on 2026-10-02. [Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- **Rate limits.** Not checked.
- **Training on uploads.** Paid tier: "Google doesn't use your prompts" or responses to improve products; prompts are logged for a limited time for abuse detection. Free tier: inputs and outputs are used to improve products and human reviewers may read them. Use the paid tier only. [Gemini API terms](https://ai.google.dev/gemini-api/terms)
- **Output terms.** "Google won't claim ownership over that content." "All generated images include a SynthID watermark." The terms page summary did not mention a rule against removing it; tracing to vector will not carry it over. [Terms](https://ai.google.dev/gemini-api/terms), [docs](https://ai.google.dev/gemini-api/docs/image-generation)

### Ideogram 3.0

- **References.** `style_reference_images` on generate and remix (JPEG, PNG or WebP, 25 MB each, 50 MB per request); also 8-character `style_codes`. [Generate v3](https://developer.ideogram.ai/api-reference/api-reference/generate-v3), [Remix v3](https://developer.ideogram.ai/api-reference/api-reference/remix-v3)
- **Cost.** $0.03 Turbo, $0.06 Default, $0.09 Quality per image; character reference costs more. The [pricing page](https://ideogram.ai/pricing/?pricing_tab=api) loads prices with JavaScript, so these figures come from a search snippet of that page and could not be confirmed. Billing is 1¢ per credit.
- **Rate limits.** "Default rate limit is 10 in-flight requests." [Pricing page](https://ideogram.ai/pricing/?pricing_tab=api)
- **Training on uploads.** API terms: "the Company agrees that it shall not use any User Input or User Output to train the Ideogram AI Model", except content flagged under the usage policies (§2.2). [API terms](https://ideogram.ai/legal/api-tos)
- **Output terms.** You own output and Ideogram assigns any rights it gains (Terms §2.1). Ideogram keeps a license to use your content to "operate, improve, promote and provide the Services" (§4.1). The API terms require developer apps to label output as made by the model, such as "Powered by Ideogram" (§2.3.1), and ban using output to build competing products (§2.3.6(A)). [Terms](https://ideogram.ai/legal/tos), [API terms](https://ideogram.ai/legal/api-tos)

## CC0 and the terms

- None of the paid API terms read here forbid releasing output under an open license. All five say the customer owns output or the provider claims none.
- CC0 only covers rights the releaser has: it applies "to the extent that he or she is an owner of Copyright and Related Rights", with a fallback license if the waiver fails. [CC0 legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode.en)
- The US Copyright Office's Part 2 report (2025-01-29) concludes that prompts alone do not make someone the author of AI output, and that human selection, arrangement or modification can be protected. So raw generated images may carry little or no US copyright, while the traced, edited vectors may carry some. CC0 handles both cases. [Copyright Office AI page](https://www.copyright.gov/ai/), [Part 2 report](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf)
- The restrictions that matter are the ones that bind It as the customer:
  - **No training models on output:** BFL (§6(c)), Recraft (§6.2). OpenAI and Ideogram restrict only *competing* models or products. This is the main conflict with the map's LoRA option.
  - **Do not remove provenance:** BFL Content Credentials (§6(i)), Recraft metadata (§6.4). Tracing to a new vector does not keep embedded metadata. Whether that counts as "removing" is an open question to put to the provider; keeping the raster original with its metadata in the provenance record is one way to stay clear of it.
  - **Attribution:** Ideogram's "Powered by Ideogram" rule for developer apps.

## Open questions

1. Does Recraft's 30-day cache clause (§3.6) apply to assets the customer owns under §6.2?
2. Does tracing a BFL or Recraft output into a new SVG count as removing Content Credentials or metadata?
3. If a LoRA is the long-term path, which providers' output can train it? On the terms read here: OpenAI, Gemini and Ideogram output, with care over "competing" language; not BFL or Recraft output.
4. Rate limits for fal, Recraft and the Gemini image models were not found.
