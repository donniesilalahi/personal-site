---
# Writing Entry Template
# Copy this file and rename it to create a new writing entry
# Filename convention: YYYY-MM-DD_{slug}.md

# Required fields
title: 'Article Title'
slug: 'article-slug' # URL-friendly slug, used in /writing/{slug}
description: 'Short description of the article shown in cards'
publishedAt: 'YYYY-MM-DD' # Format: 2024-01-15
updatedAt: '' # Optional, Format: 2024-01-20

# Classification
# topic: References a topic file slug in /content/topics/
topic: 'product-design'

# growthStage: The maturity level of this idea
#   - "seedling"  → Early idea, rough draft, just planted
#   - "budding"   → Developing, has some structure, growing
#   - "evergreen" → Mature, well-developed, timeless
growthStage: 'seedling'

# Display options
# showDescription: Whether to show description in the writing card
#   - TRUE  → Shows description below title
#   - FALSE → Only shows title
showDescription: TRUE

# SEO fields (optional - falls back to title/description if not set)
seoTitle: '' # Custom title for search engines, max 60 chars
seoDescription: '' # Custom description for search engines, max 160 chars
seoImage: '' # Custom OG image path (e.g., "/images/writings/article-og.webp")
---

Your article content goes here.

Write in Markdown format. Use headers, lists, code blocks, and other Markdown features.

## Section Heading

Content for this section...

### Subsection

More detailed content...
