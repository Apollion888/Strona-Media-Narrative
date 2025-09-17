---
title: 'Blog Management Guide'
description: 'Complete guide for managing blog content via Netlify CMS'
version: '1.0.0'
last_updated: '2025-01-12'
tags: ['blog', 'cms', 'content-management', 'netlify']
---

# Blog Management Guide {#blog-guide}

> **Comprehensive guide for creating and managing blog content on Media Narrative**

## Overview {#overview}

Media Narrative uses Netlify CMS for blog content management. This Git-based CMS allows you to create, edit, and publish blog posts directly through a web interface without touching code.

## Accessing the Blog Panel {#accessing-panel}

### Direct Access {#direct-access}

1. Navigate to `/blog` in your browser
2. Click "Otwórz Panel CMS" button
3. Alternative: Go directly to `/admin`

### Authentication {#authentication}

1. Use your Netlify account credentials
2. Or enable Netlify Identity for team members
3. Git-based authentication ensures security

## Creating a Blog Post {#creating-post}

### Step-by-Step Process {#step-by-step}

1. **Access CMS Panel**
   - Navigate to `/admin`
   - Log in with Netlify credentials

2. **Create New Post**
   - Click "Blog Posts" in sidebar
   - Click "New Blog Post" button

3. **Fill Post Details**

   ```yaml
   Title: 'Your Post Title'
   Date: 2025-01-12
   Description: 'SEO-friendly description'
   Cover Image: [Upload or select]
   Tags: ['tag1', 'tag2']
   Featured: true/false
   ```

4. **Write Content**
   - Use Markdown editor
   - Preview changes in real-time
   - Add code blocks with syntax highlighting
   - Embed images with drag-and-drop

5. **Publish**
   - Click "Publish" to make live
   - Or "Save draft" for later

### Content Structure {#content-structure}

```markdown
---
title: 'Advanced Web Development with Neural Networks'
date: 2025-01-12T10:00:00Z
description: 'Exploring neural network visualizations in modern web applications'
cover: '/images/blog/neural-networks.jpg'
tags: ['web-development', 'neural-networks', 'visualization']
featured: true
---

# Introduction

Your content here...

## Code Examples

\`\`\`javascript
const example = "your code";
\`\`\`

## Images

![Alt text](/images/blog/image.jpg)
```

## Image Management {#image-management}

### Image Requirements {#image-requirements}

| Type      | Dimensions | Format         | Max Size |
| --------- | ---------- | -------------- | -------- |
| Cover     | 1200x630px | AVIF/WebP/JPEG | 500KB    |
| Inline    | 800x600px  | AVIF/WebP/JPEG | 300KB    |
| Thumbnail | 400x300px  | AVIF/WebP/JPEG | 100KB    |

### Optimization Process {#optimization}

1. **Upload**: Drag and drop into media library
2. **Automatic Processing**:
   - Converts to AVIF/WebP
   - Generates responsive sizes
   - Compresses without quality loss
3. **Usage**: Copy markdown snippet

### Best Practices {#image-best-practices}

**DO:**

- Use descriptive filenames: `neural-network-visualization.jpg`
- Add meaningful alt text for accessibility
- Optimize before upload when possible
- Use AVIF/WebP for better performance

**DON'T:**

- Upload uncompressed images
- Use generic filenames like `image1.jpg`
- Forget alt text
- Exceed recommended dimensions

## Markdown Features {#markdown-features}

### Supported Elements {#supported-elements}

- **Headers**: `# H1` through `###### H6`
- **Bold**: `**text**` or `__text__`
- **Italic**: `*text*` or `_text_`
- **Links**: `[text](url)`
- **Images**: `![alt](url)`
- **Lists**: `- item` or `1. item`
- **Code**: `` `inline` `` or ` ```block``` `
- **Tables**: Pipe syntax
- **Blockquotes**: `> quote`
- **Horizontal rules**: `---`

### Extended Features {#extended-features}

#### Code Highlighting {#code-highlighting}

```javascript
// Syntax highlighting supported
function example() {
  return 'Highlighted code';
}
```

#### Tables {#tables}

```markdown
| Feature          | Status  | Priority |
| ---------------- | ------- | -------- |
| Neural Particles | ✅ Done | High     |
| Blog System      | ✅ Done | High     |
```

#### Task Lists {#task-lists}

```markdown
- [x] Completed task
- [ ] Pending task
```

## SEO Optimization {#seo}

### Meta Tags {#meta-tags}

Each post automatically generates:

- Page title: `Post Title | Media Narrative`
- Meta description from post description
- Open Graph tags for social sharing
- Twitter Card metadata
- Canonical URL

### SEO Checklist {#seo-checklist}

- [ ] **Title**: 50-60 characters, include keywords
- [ ] **Description**: 150-160 characters, compelling summary
- [ ] **URL Slug**: Short, descriptive, hyphenated
- [ ] **Headings**: Logical H1-H6 hierarchy
- [ ] **Images**: Optimized with alt text
- [ ] **Keywords**: Natural placement in content
- [ ] **Links**: Internal and external where relevant

## Publishing Workflow {#publishing-workflow}

### Draft to Published {#draft-published}

1. **Draft Stage**
   - Create and save as draft
   - Preview without publishing
   - Share preview link for review

2. **Review Stage**
   - Editorial review if enabled
   - Technical review for code posts
   - SEO optimization check

3. **Publishing**
   - Set publish date/time
   - Choose featured status
   - Verify all media uploaded

4. **Post-Publishing**
   - Check live URL
   - Test social sharing
   - Monitor analytics

### Scheduling Posts {#scheduling}

Set future dates to schedule posts:

```yaml
date: 2025-01-15T10:00:00Z # Will publish at this time
```

## Troubleshooting {#troubleshooting}

### Common Issues {#common-issues}

#### Can't Access Admin Panel {#access-issues}

- Clear browser cache
- Check Netlify Identity settings
- Verify Git permissions

#### Images Not Displaying {#image-issues}

- Check file path is correct
- Verify image uploaded to media folder
- Ensure proper format (AVIF/WebP/JPEG)

#### Post Not Publishing {#publishing-issues}

- Check required fields are filled
- Verify date format is correct
- Ensure no build errors in Netlify

#### Markdown Not Rendering {#markdown-issues}

- Check for syntax errors
- Verify code blocks are properly closed
- Ensure special characters are escaped

### Getting Help {#getting-help}

1. Check this documentation
2. Review Netlify CMS docs
3. Check build logs in Netlify dashboard
4. Contact support with error details

## Best Practices {#best-practices}

### Content Guidelines {#content-guidelines}

1. **Writing Style**
   - Technical but accessible
   - Clear, concise sentences
   - Active voice preferred
   - Code examples where relevant

2. **Post Structure**
   - Compelling introduction
   - Clear sections with headers
   - Code examples and visuals
   - Actionable conclusions

3. **Engagement**
   - Ask questions to readers
   - Include call-to-actions
   - Link to related posts
   - Encourage comments

### Performance Tips {#performance-tips}

1. **Images**
   - Optimize before upload
   - Use appropriate dimensions
   - Lazy load with `loading="lazy"`

2. **Content**
   - Break long posts into sections
   - Use excerpts for listings
   - Implement pagination

3. **SEO**
   - Research keywords
   - Write unique descriptions
   - Update old posts regularly

---

**Last Updated**: January 12, 2025  
**Version**: 1.0.0
