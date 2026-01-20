# website
My First website


first functionality:

# Portfolio Website with PDF Export

This is a personal portfolio website for Dimitar Porkov with built-in PDF export functionality.

## New Feature: PDF Export

### What's Added

1. **Export PDF Button** - A new button in the navigation bar (📄 Export as PDF)
2. **html2pdf.js Library** - Automatically generates a PDF from your website content
3. **Print-Optimized Styles** - Clean, professional PDF output

### How It Works

1. Click the "📄 Export as PDF" button in the navigation
2. The website automatically:
   - Switches to light mode temporarily (for better PDF readability)
   - Hides navigation, buttons, and footer
   - Generates a clean PDF with your content
   - Saves it as `Dimitar_Porkov_Portfolio.pdf`
   - Restores dark mode if it was enabled

### Files Modified

- **index.html** - Added html2pdf.js library and export button
- **script.js** - Added PDF export functionality
- **index.css** - Added print styles and export button styling

### Benefits

✅ One-click PDF generation
✅ No server-side processing needed
✅ Works entirely in the browser
✅ Automatically optimized for printing
✅ Maintains dark mode preference after export

### Deployment

Simply upload these files to your GitHub Pages repository:
- index.html
- index.css
- script.js

The PDF export will work immediately without any additional setup.

### Browser Compatibility

Works in all modern browsers:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Alternative: Print to PDF

Users can also use their browser's built-in print function (Ctrl+P / Cmd+P) and select "Save as PDF" for a similar result.
