// Global configuration - swap this file at deploy time to change branding
const PRODUCT_NAME = 'ELSA';

const CONFIG = {
  productName: PRODUCT_NAME,
  tagline: 'Enterprise AI Platform',
  sidebarBranding: `${PRODUCT_NAME} Training`,
  logoSubtitle: `${PRODUCT_NAME} 101`,
  pageTitle: `ELSA Training  -  FDA 2026`,

  // Day locking configuration
  // Set to empty array [] to unlock all days
  // Day numbers are 1-indexed (Day 1, Day 2, etc.)
  lockedDays: [],

  // ── PRESENTER CONFIG ────────────────────────────────────────────────────────
  // Fill these in before training day. They appear live in code examples and
  // callouts throughout the slides  -  one change here updates everywhere.
  //
  // elsaUrl           -  platform base URL, no trailing slash
  //                    e.g. https://elsa.example.gov/Monolith
  // openaiEndpoint    -  OpenAI-compatible API endpoint (for Python/OpenAI SDK)
  //                    typically: <elsaUrl>/api/engine/openai/v1
  // anthropicEndpoint  -  Anthropic-compatible endpoint (for Claude Code settings.json)
  //                    typically: <elsaUrl>/api/engine/anthropic/v1
  // templateRepoUrl   -  git clone URL attendees use in the Vibe Coding exercise
  // sharedModelEngineId  -  model engine ID shown in Pixel and API code examples
  // ─────────────────────────────────────────────────────────────────────────────
  elsaUrl:             'https://elsa.dev.fda.gov/SemossWeb/packages/client/dist/',
  openaiEndpoint:      'https://elsa.dev.fda.gov/Monolith/api/model/openai',
  anthropicEndpoint:   'https://elsa.dev.fda.gov/Monolith/api/model/anthropic',
  templateRepoUrl:     'https://github.com/elsa-chat/vibe-setup.git',
  templateFolderName:  'vibe-setup',
  sharedModelEngineId: '8405ac40-89c6-4613-848c-3d89986fbc01',
  claudeCodeModelId:   'SET_BEFORE_TRAINING',
  aiName:              'Elsa Chat',
};
