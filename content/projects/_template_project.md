---
# Project Entry Template
# Copy this file and rename it to create a new project entry
# Filename convention: {slug}.md

# Required fields
title: 'Project Title'
slug: 'project-slug' # URL-friendly slug, used in /project/{slug}
description: 'Short description of the project shown in cards (max 2 lines)'
publishedAt: 'YYYY-MM-DD' # Format: 2024-01-15

# Visual highlights (1-3 images, 4:3 ratio recommended)
# - 1 image: Takes 80% of available space, no rotation
# - 2 images: 55% width each, rotated ±4 degrees
# - 3 images: 55% width each, first +4°, second 0°, third -4°
visuals:
  - '/images/projects/project-slug/visual-1.webp'
  - '/images/projects/project-slug/visual-2.webp'
  - '/images/projects/project-slug/visual-3.webp'

# Optional background image for the visual area
backgroundImage: '/images/projects/project-slug/background.webp'

# Meta information
# roles: Array of roles (displayed as ROLE + ROLE in ALL CAPS)
roles:
  - 'Product Designer'
  - 'Frontend Developer'

# tags: Array of tags (displayed as #tag #tag in lowercase)
tags:
  - 'mobile'
  - 'fintech'
  - 'design-system'

# status: Publication status
#   - "draft"     → Not visible on the site
#   - "published" → Visible on the site
status: 'draft'

# SEO fields (optional - falls back to title/description if not set)
seoTitle: '' # Custom title for search engines, max 60 chars
seoDescription: '' # Custom description for search engines, max 160 chars
seoImage: '' # Custom OG image path (e.g., "/images/projects/project-slug-og.webp")
---

Your detailed project content goes here.

Write in Markdown format. Use headers, lists, code blocks, and other Markdown features.

## Overview

Brief overview of the project, its goals, and context.

## Problem Statement

What problem were you solving? What challenges did you face?

## Solution

How did you approach the solution? What decisions did you make?

## Process

Describe your design/development process.

## Results

What were the outcomes? Metrics, learnings, etc.

## Reflections

What would you do differently? What did you learn?
