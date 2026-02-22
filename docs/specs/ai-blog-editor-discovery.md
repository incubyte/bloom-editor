# Discovery: AI-First Blog Editor

## Why

Solo creators and indie hackers building personal brands face a painful writing pipeline. The blank page is intimidating. Maintaining a consistent voice across dozens of posts is hard. And the journey from a rough idea, audio note, or call transcript to a polished, published blog takes far too long.

Existing tools force a choice: use a beautiful editor with no AI help, or bolt AI onto a mediocre writing experience. Nobody has built an editor where AI is a first-class citizen from day one -- one that understands your voice, knows your audience, and actively coaches you while you write.

## Who
**Primary persona (build for first):** Solo creators, indie hackers, and thought leaders who publish regularly to build a personal brand. They write 2-8 posts per month. They care deeply about sounding like themselves, not like a robot. They value speed but refuse to sacrifice originality.

**Blog idea generation:** The AI proactively generates blog topic ideas twice a week, drawn from two sources: (1) patterns and themes in the writer's past blogs, and (2) relevant trending topics and conversations found via web search. The writer never has to face a blank page wondering "what should I write about?"
<!-- -------- bee-comment -------- -->
> **@developer**: i like the point that you mentioned 2-8 posts. How about twice a week idea generated, for the author. Ideas will come from the examples of earlier blogs as well as relvant online searches.
> **@bee**: Added "Blog idea generation" as a core capability tied to the primary persona. Twice-weekly AI-generated ideas sourced from past writing patterns + web search. Also added this to Phase 2 deliverables (it requires the AI layer).
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Secondary persona (later):** Small marketing teams producing company blog content. They need shared voice profiles, collaborative editing, and approval workflows.

## Success Criteria
- A solo creator can go from rough idea to polished draft in under 30 minutes (down from 2-3 hours today)
- The final output is higher quality than what the writer would produce alone -- better structured, more engaging, with stronger references
- The AI acts as a brainstorming partner and editor: it generates ideas, challenges weak arguments, suggests angles the writer hadn't considered
- Voice consistency is measurable: the review system can score whether a post sounds like the author's established voice
- Writers feel the AI is a collaborator, not a replacement -- they stay in creative control at all times
- The editor feels as good to write in as iA Writer or Bear -- clean, fast, distraction-free
- Users can repurpose existing content (transcripts, notes) into blog posts without starting from scratch
<!-- -------- bee-comment -------- -->
> **@developer**: speed is not the only success criteria, it's the quality of the conent too, and offering a brainstorming parter or editor to the author
> **@bee**: Added two new success criteria: (1) output quality is higher than writing alone, and (2) the AI acts as a brainstorming partner and editor — generating ideas, challenging arguments, suggesting new angles. Speed is still there, but it's no longer the lead criterion.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

## Problem Statement

Writing high-quality blog content consistently is the bottleneck for solo creators building personal brands. The process is slow, the blank page is paralyzing, voice drifts across posts, and rich source material (call recordings, audio notes, existing drafts) goes unused. Current tools either help you write fast (but sound generic) or write well (but offer no AI assistance). This editor closes that gap: AI-native, voice-aware, and beautiful enough that writers want to live in it.

## Hypotheses

- H1: If the editor can learn a writer's tone from 3-5 existing posts, it can generate suggestions that feel authentic rather than generic -- and writers will accept more than 50% of them.
- H2: Margin-style comments (accept/reject) plus a chat sidebar will feel more like a collaborator than inline ghost text, which feels like the AI is writing for you.
- H3: A review system that scores blogs AND suggests real-world references/content to strengthen them will be perceived as significantly more valuable than a review that only evaluates.
- H4: Paste-transcript-to-blog is sufficient for Phase 1. Most users already have transcripts from Otter, Fireflies, or similar tools. Built-in transcription can wait.
- H5: Local-first architecture will be a selling point for privacy-conscious solo creators who don't want their drafts on someone else's server.

## Out of Scope

- Team collaboration features (shared voice profiles, multi-user editing, approval workflows)
- Cloud sync and account system (local-first only for initial release)
- Built-in audio/video transcription (Phase 1 accepts pasted transcripts only)
- Mobile or web versions (desktop-only)
- Publishing integrations (WordPress, Ghost, Substack, Medium) -- future phase
- Image generation or visual content creation
- SEO optimization tooling (may revisit after core is solid)

## Copilot UX Model

The AI copilot operates in two modes that work together:

**Margin Comments (passive, always-on):** As the user writes, the AI reads the content and surfaces suggestions as comments anchored to specific sentences or paragraphs in the right margin. The user can accept, reject, or ignore each one. Comments cover: clarity improvements, stronger word choices, structural suggestions, voice drift warnings, and factual checks. This should feel like a thoughtful editor reviewing your work in real time -- not overwhelming, not noisy.

**Chat Sidebar (active, on-demand):** A collapsible panel where the user can have a conversation with the AI about their draft. Use cases include: "Help me rewrite this paragraph," "Give me three opening hook options," "What's missing from this section?" The chat is context-aware -- it knows the full draft, the voice profile, and the target audience.

## Voice/Tone System

Three input methods for establishing a writer's voice:

1. **Link analysis:** User provides URLs to 3-5 existing blog posts. The system extracts writing samples, analyzes patterns (sentence structure, vocabulary level, formality, humor, rhetorical style), and builds a voice profile.
2. **Predefined tones:** A curated list of tone presets (e.g., "Conversational and direct," "Academic but accessible," "Witty and opinionated") for users who don't have existing content to analyze.
3. **Custom prompt:** A freeform text field where the user describes their desired voice in their own words (e.g., "I write like I'm explaining something to a smart friend over coffee").

Voice profiles are persisted locally and applied to all AI suggestions and generations.

## Review System (Differentiator)

The on-demand review is both evaluative and generative:

**Scoring dimensions:**
- Clarity: Is the writing easy to follow? Are ideas well-explained?
- Structure: Does the post flow logically? Are transitions smooth?
- Voice consistency: Does this sound like the author's established voice?
- Audience fit: Will this resonate with the defined target audience?
- Hook strength: Does the opening grab attention and compel reading?
- Originality: Does it offer a fresh perspective, or rehash what's already out there?
- Readability: Sentence length variation, paragraph length, scanability (subheadings, bullets)
- Actionability: Does the reader walk away with something concrete to do or think about?
- Shareability: Are there quotable moments? Would someone share this on social?
<!-- -------- bee-comment -------- -->
> **@developer**: any other dimesnsions you can think of when it comes to writing blogs or social media content?
> **@bee**: Added 5 dimensions: Hook strength (does the opening grab?), Originality (fresh perspective?), Readability (scanability, sentence variety), Actionability (concrete takeaways), and Shareability (quotable moments). These cover the full lifecycle from "will they click" to "will they share."
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

**Web-augmented suggestions:**
- The review searches the web for recent, relevant content related to the blog's topic
- Suggests specific references, statistics, examples, or counter-arguments that would strengthen the post
- This turns the review from a report card into a creative partner -- it doesn't just tell you what's weak, it hands you material to make it stronger

## Design Direction

Bear + Agenda aesthetic: warm minimalism, typography-focused, Apple-like polish. Content is the hero. Lots of whitespace. The AI features are present but never visually dominant -- they appear when useful and recede when not needed. Think of it as a premium writing instrument that happens to have a brilliant editor built in.

## Milestone Map
<!-- -------- bee-comment -------- -->
> **@developer**: i would keep focus on just creating a kickass desktop editor in the first phase. AI comes in the later phase. This is the phase where we will open source the notetaker. Next steps and other products will be built on this opensource version.
> **@bee**: Major restructure. Phase 1 is now a pure, beautiful desktop editor — no AI. This becomes the open-source foundation. AI features (copilot, voice profiles, review) move to Phase 2. Remaining phases shifted accordingly.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

### Phase 1: The Editor (Open Source)

A beautiful, open-source desktop writing app. No AI — just a best-in-class editor that writers love using.

**Delivers:** A writer can open the app, create and organize documents, and write in a clean, distraction-free environment. Drafts are saved locally as JSON files with a custom extension. This is the open-source foundation that all future products build on.

- Tauri desktop app shell (window management, menu bar, app lifecycle)
- Tiptap editor with clean, minimal UI (Bear/Agenda-inspired typography and layout)
- Rich text editing: headings, bold, italic, lists, code blocks, links, blockquotes
- Local draft storage (JSON files with custom extension — create, open, save, auto-save)
- Document organization (sidebar with note list, folders/tags, search)
- Keyboard-first UX (command palette, shortcuts for all common actions)
- Dark mode / light mode
- Export to Markdown, HTML

### Phase 2: The AI Copilot

Layer AI onto the open-source editor. Voice-aware, audience-aware, always-on.

**Delivers:** A solo creator can set up their voice profile, define a target audience, and write with real-time AI margin comments and a chat sidebar for deeper help.

- AI provider abstraction layer (start with GPT 5.2, architected for multi-provider)
- Voice profile setup (all three methods: link analysis, presets, custom prompt)
- Target audience definition (simple form: who are you writing for?)
- AI copilot: margin comments (sentence and paragraph level suggestions)
- AI copilot: chat sidebar (context-aware conversation about the draft)
- Blog idea generation (twice-weekly AI-generated ideas based on past writing + web search)

### Phase 3: From Raw to Refined

Turn messy inputs into polished drafts. The blog review becomes a creative partner.

**Delivers:** A user can paste a transcript or dump raw thoughts, and the AI shapes it into a structured blog draft. The review system scores the post and suggests real-world content to strengthen it.

- Raw thoughts to blog: paste or type unstructured ideas, AI generates a structured draft
- Transcript to blog: paste a call/meeting transcript, AI reshapes it into a blog post
- Blog review system: multi-dimension scoring (all review dimensions)
- Web-augmented review: searches for relevant references, stats, and examples to suggest

### Phase 4: Full Audio/Video Pipeline

The app handles the entire journey from spoken word to published post.

**Delivers:** A user can upload or record audio/video, and the app transcribes it and generates a blog draft. Multiple AI providers are available.

- Built-in audio recording with local transcription
- Video/audio file upload with transcription
- Multi-provider AI support (add Claude, Gemini, or other providers alongside GPT)
- Audio note to blog: record a voice memo directly in the app, AI transcribes and drafts

### Phase 5: Connected and Collaborative

Expand beyond the solo creator. Cloud sync, publishing, and team features.

**Delivers:** Users can sync drafts across devices, publish directly to platforms, and teams can share voice profiles.

- Cloud sync (optional, privacy-respecting)
- Publishing integrations (Ghost, Substack, WordPress, Medium)
- Shared voice profiles for teams
- Collaborative editing
- Account system and subscription model

## Module Structure

- `editor/` -- owns: Tiptap setup, custom extensions, editor state, document model. Depends on: (none)
- `copilot/` -- owns: margin comments, chat sidebar, suggestion lifecycle. Depends on: editor, ai-provider, voice
- `voice/` -- owns: voice profile creation, storage, tone analysis from links. Depends on: ai-provider
- `ai-provider/` -- owns: LLM abstraction layer, provider configs, request routing. Depends on: (none)
- `review/` -- owns: blog scoring, web search for references, review UI. Depends on: ai-provider, voice, editor
- `transcription/` -- owns: audio recording, file upload, speech-to-text. Depends on: ai-provider
- `storage/` -- owns: local draft persistence, file management, settings. Depends on: (none)
- `shell/` -- owns: desktop app window, menu bar, app lifecycle. Depends on: (none)

## Open Questions
1. **~~Electron vs Tauri?~~ Decided: Tauri.** Lighter, Rust-based, better fit for a local-first app that values performance and small binary size. The ecosystem is mature enough for our needs (Tiptap runs in a webview either way).
<!-- -------- bee-comment -------- -->
> **@developer**: let's go with tauri
> **@bee**: Resolved. Tauri it is — lighter binary, Rust backend for local file operations, and the Tiptap editor runs in the webview identically. Updated Phase 1 deliverables to reference Tauri.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
2. **Local storage format: Two JSON file types.**
   - **Article files** (one per article, custom extension e.g. `.bloom`): Contains the article content (Tiptap JSON document) plus per-article metadata (title, created date, modified date, tags, target audience, status).
   - **Profile file(s)** (one per author profile): Contains author-level data — voice/tone settings, interests, preferred topics, writing style parameters. Lives in the app's config directory.
   - This separation means articles are portable (share/export a single file) while profile data stays with the app. SQLite can be introduced later if search/indexing demands it.
<!-- -------- bee-comment -------- -->
> **@developer**: what are your thoughts on starting with simple json file? It can have it's own extension
> **@bee**: Resolved the open question. JSON with a custom extension is a great fit for Phase 1 — simple, portable, no dependencies. Noted that SQLite can be added later if needed for search performance.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->
<!-- -------- bee-comment -------- -->
> **@developer**: what about having two jsons. One each for every article, which can have the text plus metadata for each article, and other can be the profile(s). This is where the author related data can be stored (tone, interests etc)
> **@bee**: Refined the storage design into two distinct file types: (1) article files — one JSON per article with content + metadata, custom extension, portable. (2) Profile files — author-level data (tone, interests, style) in the config directory. Clean separation of concerns.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

3. **Voice analysis: LLM-driven.** No custom NLP pipeline — send writing samples to the LLM with a well-crafted, non-prescriptive prompt that lets the model extract voice characteristics organically. The prompt should ask the LLM to describe the writing style in its own terms rather than prescribing specific dimensions to extract.
<!-- -------- bee-comment -------- -->
> **@developer**: for voice analysis i would let an LLM agent do the job. We should write a good non-prescriptive prompt
> **@bee**: Resolved. Voice analysis will be LLM-driven with a non-prescriptive prompt — no custom NLP needed. The LLM describes the writing style in its own terms. Much simpler to build and likely more nuanced than hand-picked dimensions.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

4. **Copilot entry point: start with a review button.** Rather than always-on margin comments from day one, start with a simple "Review" button the writer clicks when ready. This is less invasive, easier to build, and lets us iterate on the AI feedback quality before making it continuous. Always-on copilot comments can be layered in later.
<!-- -------- bee-comment -------- -->
> **@developer**: how about, to start with, let's just create a review button
> **@bee**: Simplified the copilot MVP. Instead of always-on margin comments, Phase 2 starts with a Review button — writer clicks it when ready for feedback. Less invasive, easier to build, and we can tune AI quality before going always-on.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

5. **Review output: dimensions without scores.** The review provides qualitative feedback organized by dimensions (clarity, structure, voice, hook, etc.) but does not assign numeric scores. Think editor's notes, not a report card.
<!-- -------- bee-comment -------- -->
> **@developer**: i mentioned a rubric, but i just meant dimensions for reviews, we do not necessarily have to give a score.
> **@bee**: Reframed. Reviews give qualitative feedback per dimension — no numeric scores. More like editor's notes than a report card. Updated the Review System section language accordingly.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

6. **~~Web search for review~~: Use LLM provider's built-in web search.** No separate search API integration needed — use whatever web search capability the LLM provider offers (e.g., GPT with browsing, Claude with web search). Keeps the architecture simple.
<!-- -------- bee-comment -------- -->
> **@developer**: we will use web search of whatever LLM provider gives
> **@bee**: Resolved. No separate search API — use the LLM provider's built-in web search. One less integration to maintain.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

7. **Pricing: Monthly subscription with AI usage limits.** Free tier during early access. Monthly subscription once stable. AI usage is metered (needs usage tracking in the architecture, but no account system needed until this is activated).
<!-- -------- bee-comment -------- -->
> **@developer**: this will be a monthly subscription with AI usage limit (but early on we will keep it free)
> **@bee**: Resolved. Monthly subscription with AI usage limits, free during early access. This means we need usage tracking in the AI provider abstraction layer, but no account/payment system until later phases.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

8. **~~Offline AI~~: Not needed.** Editor works fully offline. All AI features require internet. Clean separation — no local model complexity.
<!-- -------- bee-comment -------- -->
> **@developer**: no offline ai needed, without internet only editor will work, with internet all ai functions
> **@bee**: Resolved. Editor = offline-capable, AI = online-only. This simplifies the architecture significantly — no local model bundling or fallback logic needed.
> - [x] mark as resolved
<!-- -------- /bee-comment -------- -->

## Revised Assessment

- **Size:** EPIC (5 phases, multiple complex subsystems)
- **Risk:** MODERATE (core tech is proven -- Tiptap, LLM APIs, desktop frameworks -- but the voice analysis and copilot UX are novel and need iteration)
- **Greenfield:** Yes (empty repo, building from scratch)

---

[x] Reviewed
