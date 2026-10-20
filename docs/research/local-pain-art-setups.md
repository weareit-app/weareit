# Local setups for on-style pain art

Research for [#29](https://github.com/weareit-app/weareit/issues/29) (map [#28](https://github.com/weareit-app/weareit/issues/28)). Checked 2026-10-19 against model cards, official repos and license texts. Nothing here was run on the founder's machines: speeds and style fidelity are for the bake-off to measure.

## The target

The 21 drawings in `apps/app/assets/brand/drawings/` are near-binary: solid black silhouettes on white, chunky rounded shapes, thin white cut lines for detail (like a stencil or linocut), no gradients, no hatching. That helps us. Any model that can hold "bold flat black shapes on white" is close enough, because `tools/icon-trace/` re-draws the result as vector anyway. Fine texture and exact line quality matter less than silhouette, weight and simplicity.

## Ranked setups for the bake-off

| # | Setup | Where | Training | Weights license | Outputs CC0? |
|---|---|---|---|---|---|
| 1 | FLUX.2 [klein] 4B (distilled), 2–3 anchor drawings as reference images | ComfyUI on 3070 (fp8); Draw Things on Mac | None | Apache 2.0 | Yes |
| 2 | SDXL + IP-Adapter (style weight type) | ComfyUI on 3070 | None | CreativeML OpenRAIL++-M | Yes |
| 3 | SDXL style LoRA on ~20 drawings | kohya sd-scripts on 3070; Draw Things on Mac | ~20 images | CreativeML OpenRAIL++-M | Yes |
| 4 | Z-Image-Turbo, prompt only (later: LoRA on Z-Image base) | ComfyUI on Mac or 3070 with offload | Optional | Apache 2.0 | Yes |
| 5 | FLUX.2 [klein] 4B Base style LoRA | ai-toolkit or OneTrainer on 3070 | ~20 images | Apache 2.0 | Yes |

Do not use: FLUX.1 [dev], FLUX.1 Redux [dev], FLUX.1 Kontext [dev], FLUX.2 [dev], FLUX.2 [klein] 9B. See "License blockers".

### 1. FLUX.2 [klein] 4B with reference images

- The 4B model is step- and guidance-distilled, Apache 2.0, and does text-to-image plus single- and multi-reference editing in one model ([BFL flux2 README](https://github.com/black-forest-labs/flux2); [model card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)).
- BFL says the 4B fits in about 8 GB of VRAM ([README](https://github.com/black-forest-labs/flux2)); the model card says about 13 GB ([card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)). ComfyUI ships fp8 weights and measured about 8.4 GB VRAM and about 1.2 s end to end for the distilled 4B on an RTX 5090 ([ComfyUI docs](https://docs.comfy.org/tutorials/flux/flux-2-klein)). On an 8 GB 3070 it is at the edge, so ComfyUI will offload the 4B Qwen3 text encoder; expect it to work, slower than the 5090 figure.
- Four steps ([card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)), so it is the fastest option and good for many candidates per pain.
- Style from reference: feed two or three anchor drawings as references and describe the new scene. This is the only no-training route here that uses a modern model under a permissive license. How closely it holds the style is the main thing to test.
- Draw Things lists FLUX.2 support ([App Store listing](https://apps.apple.com/app/draw-things/id6444050820)).

### 2. SDXL + IP-Adapter

- IP-Adapter weights are Apache 2.0, with SDXL variants including `ip-adapter-plus_sdxl_vit-h` ([h94/IP-Adapter](https://huggingface.co/h94/IP-Adapter)).
- The ComfyUI node pack (ComfyUI_IPAdapter_plus, GPL-3.0) supports style and composition transfer for SDXL, credits InstantStyle, and lists an SDXL model as "very strong style transfer". It has been in maintenance mode since 2025-04-14 ([repo](https://github.com/cubiq/ComfyUI_IPAdapter_plus)). It still works but will not get new features. The tool's GPL does not touch the images.
- SDXL fits comfortably in 8 GB and has the most mature tooling (ControlNets, LoRAs, inpainting).
- Weakness: SDXL's prompt following is weaker than FLUX.2 or Z-Image, so concepts with several people or objects may need more tries.

### 3. SDXL style LoRA (about 20 images)

- kohya sd-scripts (Apache 2.0) documents SDXL LoRA training "with 8GB GPU memory (10GB recommended)": train U-Net only, gradient checkpointing, cache text encoder outputs and latents, an 8-bit optimizer or Adafactor, and dim 4 to 8 on 8 GB ([train_SDXL-en.md](https://github.com/kohya-ss/sd-scripts/blob/main/docs/train_SDXL-en.md)).
- Draw Things trains SDXL LoRAs on the Mac. Its 2023 engineering post measured SDXL at about 10.3 GiB peak and 14 minutes for 500 steps at 512×512 on an M2 Ultra ([Draw Things engineering](https://engineering.drawthings.ai/p/draw-things-democratizes-local-large-model-fine-tuning-on-iphone-ipad-and-mac-2ceb60b5b462)). Its wiki says SDXL at 1024 typically needs 16–32 GB+ of RAM to avoid swapping, and 500–4,000 steps ([wiki](https://wiki.drawthings.ai/wiki/LoRa_Training_Notes)).
- Rough time per run (estimate, not measured): about an hour or two at 1024 on the 3070 for 1,500–2,000 steps; on the Mac it depends on the chip and RAM, which this research does not know.
- Best long-term fidelity among options that fit 8 GB, but it costs a training loop. Do it after the reference-image routes, using approved outputs plus the 21 anchors.

### 4. Z-Image-Turbo

- 6B, Apache 2.0, 8 steps, no guidance; the card says it fits 16 GB consumer devices ([card](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo)). ComfyUI ships it in bf16 with the same 4B Qwen3 text encoder as klein ([ComfyUI docs](https://docs.comfy.org/tutorials/image/z-image/z-image-turbo)). On the 3070 it needs offloading or a quantized build; on a Mac with enough RAM it runs in full.
- No reference-image style route; ComfyUI offers a ControlNet union (canny, HED, depth, pose) only ([ComfyUI docs](https://docs.comfy.org/tutorials/image/z-image/z-image-turbo)). Style comes from the prompt alone, or from a LoRA trained on the undistilled Z-Image base (Apache 2.0, rated "easy" to fine-tune; [card](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo)).
- Worth one prompt-only round: strong prompt following, and bold flat silhouettes are a simple style to prompt.

### 5. FLUX.2 [klein] 4B Base LoRA

- BFL points to the undistilled 4B Base (Apache 2.0) for fine-tuning on limited hardware; it needs about 50 steps to sample ([README](https://github.com/black-forest-labs/flux2)). ComfyUI measured 9.2 GB VRAM and about 17 s for the base on a 5090 ([ComfyUI docs](https://docs.comfy.org/tutorials/flux/flux-2-klein)).
- Trainers: ai-toolkit (MIT) lists FLUX.2-klein-base-4B, Z-Image, SDXL and Qwen-Image, but gives no VRAM minimums; Mac support is experimental ([repo](https://github.com/ostris/ai-toolkit)). OneTrainer (AGPL-3.0) lists Z-Image, FLUX.2 Klein, SDXL and others, and installs on Mac ([README](https://github.com/Nerogar/OneTrainer)). Neither documents an 8 GB figure for klein, so treat 8 GB training as unproven.
- Draw Things added LoRA training for FLUX.2 [klein], Z Image and Qwen Image ([wiki](https://wiki.drawthings.ai/wiki/LoRa_Training_Notes); [downloads](https://drawthings.ai/downloads/)), but [issue #114](https://github.com/drawthingsai/draw-things-community/issues/114) (open as of 2026-10-19) reports training crashing at step 0 for klein and Z-Image on Apple Silicon, while SDXL training works on the same machine.
- If option 1 holds style well, a LoRA on the same model is the natural long-term path.

### Considered and set aside

- **FLUX.1 [schnell]**: Apache 2.0, 4 steps ([card](https://huggingface.co/black-forest-labs/FLUX.1-schnell)), but 12B and its style-reference adapter (Redux) is under the dev license. FLUX.2 [klein] 4B does the same job smaller and with references built in.
- **Chroma**: Apache 2.0 ([card](https://huggingface.co/lodestones/Chroma)), schnell-derived and similar size; no advantage for this style.
- **Qwen-Image**: Apache 2.0 ([card](https://huggingface.co/Qwen/Qwen-Image)) but 20B; impractical on 8 GB.
- **SD 3.5**: Stability Community License. Outputs are yours, but the license ends if annual revenue passes USD 1M, and outputs may not be used to build other foundation models ([license](https://stability.ai/community-license-agreement)). Workable but nothing it offers beats the options above.

## License blockers

- **FLUX.1 [dev] and anything under its license (Redux [dev], Kontext [dev]), FLUX.2 [dev], FLUX.2 [klein] 9B and 9B Base.** The FLUX.1 [dev] license allows use only for Non-Commercial Purposes (§2(a)–(b)), and §1(c) says use "in direct interactions with or that has impact on end users" is not a Non-Commercial Purpose. §4(a) also bars using "any data produced by" the model for commercial or production purposes ([license text](https://github.com/black-forest-labs/flux/blob/main/model_licenses/LICENSE-FLUX1-dev)). The outputs clause (§2(d)) lets you use outputs for any purpose, but making art for a shipped app is still production use of the model. Treat these as off limits. The 9B klein models and FLUX.2 [dev] are under the FLUX Non-Commercial license ([flux2 README](https://github.com/black-forest-labs/flux2)).

## Can outputs be CC0?

- **Apache 2.0 models** (FLUX.2 [klein] 4B and 4B Base, Z-Image, Qwen-Image, Chroma, FLUX.1 [schnell]): Apache 2.0 governs the weights and code, not images they produce. Outputs can be released as CC0.
- **SDXL (CreativeML OpenRAIL++-M)**: the licensor "claims no rights in the Output", but outputs may not be used against the Attachment A use restrictions ([license](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/blob/main/LICENSE.md)). The use restrictions must be passed on when distributing the model or a derivative such as a LoRA, not when distributing images. CC0 on the images is fine. If an SDXL LoRA is ever published, it must carry the OpenRAIL++ restrictions.
- **Tools** (ComfyUI and IPAdapter_plus GPL-3.0, Draw Things community GPL-3.0, OneTrainer AGPL-3.0, ai-toolkit MIT, sd-scripts Apache 2.0): their licenses cover the software, not the images.
- In the US, purely AI-generated material is not protected by copyright, while human selection, arrangement and modification can be ([US Copyright Office, Copyright and AI Part 2, January 2025](https://www.copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf)). CC0 dedicates whatever rights exist, including any in the hand-traced vector, so it fits either way. The licensing doc already asks to keep generation, selection, editing and cleanup provenance.

## For the bake-off

- Use the same five or six pain concepts across all setups, and score silhouette weight, simplicity, and how well the result traces.
- Record per setup: VRAM peak, seconds per 1024×1024 image on the 3070 and on the Mac, and candidates needed per usable image.
- Unknown: the Mac's chip and RAM. That decides whether Z-Image and SDXL training are comfortable on the Mac.
