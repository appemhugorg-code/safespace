# Rich Text Editor Guide

## Overview

The SafeSpace article editor is a powerful, block-based content editor similar to WordPress Gutenberg. It allows therapists and admins to create rich, formatted content with images, links, and various text styles.

## Features

### Text Formatting
- **Bold** - Make text stand out
- *Italic* - Emphasize text
- <u>Underline</u> - Underline important text
- ~~Strikethrough~~ - Cross out text
- `Code` - Inline code formatting

### Headings
- **Heading 1** - Main article headings
- **Heading 2** - Section headings
- **Heading 3** - Subsection headings

### Lists
- **Bullet Lists** - Unordered lists with bullet points
- **Numbered Lists** - Ordered lists with numbers
- **Blockquotes** - Highlight important quotes or callouts

### Text Alignment
- Align Left
- Align Center
- Align Right
- Justify

### Media & Links
- **Images** - Insert images from URL or upload from your device
  - Add captions to images for accessibility
  - Images are automatically responsive
- **Links** - Add hyperlinks to text
  - Click the link icon and enter the URL
  - Select text first to make it a link

### Undo/Redo
- Undo recent changes
- Redo changes you've undone

## How to Use

### Creating an Article

1. Navigate to **Articles** → **Create New Article**
2. Enter the article title
3. Add an optional excerpt (summary)
4. Select the target audience (Children, Guardians, or Both)
5. Use the rich text editor to write your content

### Adding Images

1. Click the **Image** icon in the toolbar
2. Choose between:
   - **From URL**: Paste an image URL from the web
   - **Upload**: Select an image from your device
3. Add an optional caption for accessibility
4. Click **Insert Image**

### Adding Links

1. Select the text you want to link
2. Click the **Link** icon in the toolbar
3. Enter the URL
4. Press Enter or click outside to apply

### Formatting Text

1. Select the text you want to format
2. Click the appropriate formatting button in the toolbar
3. The formatting will be applied immediately

### Saving Your Work

- **Save as Draft** - Save your work without submitting for review
- **Submit for Review** - Submit your article for admin approval

## Best Practices

### For Children's Content
- Use simple, clear language
- Add colorful, engaging images
- Break content into short paragraphs
- Use headings to organize content
- Include encouraging messages

### For Guardian Content
- Provide actionable advice
- Use professional but accessible language
- Include relevant resources and links
- Add supporting images or diagrams
- Structure content with clear sections

### Image Guidelines
- Use high-quality, relevant images
- Always add descriptive captions
- Ensure images are appropriate for the target audience
- Keep file sizes reasonable for fast loading
- Use images that support the article content

### Accessibility
- Add alt text/captions to all images
- Use headings in logical order (H1 → H2 → H3)
- Ensure sufficient color contrast
- Write descriptive link text (avoid "click here")
- Keep paragraphs concise and readable

## Keyboard Shortcuts

- **Ctrl/Cmd + B** - Bold
- **Ctrl/Cmd + I** - Italic
- **Ctrl/Cmd + U** - Underline
- **Ctrl/Cmd + Z** - Undo
- **Ctrl/Cmd + Shift + Z** - Redo
- **Ctrl/Cmd + K** - Add link

## Technical Details

The editor uses **Tiptap**, a modern, extensible rich text editor built on ProseMirror. It stores content as HTML, which is sanitized on the server for security.

### Supported HTML Elements
- Paragraphs, headings (h1-h3)
- Bold, italic, underline, strikethrough
- Ordered and unordered lists
- Blockquotes
- Images with alt text
- Links
- Code blocks and inline code

## Troubleshooting

### Images Not Loading
- Verify the image URL is correct and accessible
- Check that the image format is supported (JPG, PNG, GIF, WebP)
- Ensure the image is hosted on a secure (HTTPS) server

### Formatting Not Applying
- Make sure text is selected before applying formatting
- Try refreshing the page if the editor becomes unresponsive
- Check browser console for any errors

### Content Not Saving
- Ensure you have a stable internet connection
- Verify you have permission to create/edit articles
- Check that all required fields are filled

## Support

If you encounter any issues with the editor, please contact the system administrator or submit a support ticket.
