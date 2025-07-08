# Hugging Face API Setup Guide

## Overview
The AI Sales Assistant Pro v2 component uses Hugging Face's free AI service to generate custom content. This guide will walk you through setting up the API key to enable AI content generation.

## Step 1: Create a Free Hugging Face Account

1. **Go to Hugging Face**: Visit [https://huggingface.co](https://huggingface.co)
2. **Sign Up**: Click "Sign Up" and create a free account
3. **Verify Email**: Check your email and verify your account

## Step 2: Generate Your API Key

1. **Access Settings**: After logging in, click on your profile picture in the top right
2. **Navigate to Settings**: Select "Settings" from the dropdown menu
3. **Find Access Tokens**: Click on "Access Tokens" in the left sidebar
4. **Create New Token**: 
   - Click "New token" button
   - Name it something like "Salesforce AI Assistant"
   - Select "Read" permissions (sufficient for our use case)
   - Click "Generate a token"
5. **Copy Your Token**: Copy the generated token immediately (you won't be able to see it again)

## Step 3: Configure the API Key in Salesforce

### Option A: Using Setup Menu (Recommended)
1. **Open Setup**: In your Salesforce org, click the gear icon and select "Setup"
2. **Navigate to Custom Metadata Types**: 
   - In Quick Find, search for "Custom Metadata Types"
   - Click on "Custom Metadata Types"
3. **Find AI Service Config**:
   - Look for "AI Service Config" in the list
   - Click "Manage Records" next to it
4. **Edit the Configuration**:
   - Click "Edit" next to "Hugging Face Config"
   - Replace "PLACEHOLDER_API_KEY" with your actual API key
   - Click "Save"

### Option B: Using Developer Console
1. **Open Developer Console**: Setup → Developer Console
2. **Execute Anonymous Code**: Debug → Execute Anonymous Apex
3. **Run This Code** (replace YOUR_API_KEY_HERE with your actual key):
   ```apex
   AI_Service_Config__mdt config = [SELECT Id FROM AI_Service_Config__mdt WHERE DeveloperName = 'Hugging_Face_Config'];
   // Note: Custom Metadata Types can't be updated via Apex in this way
   // Use Setup Menu method instead
   ```

## Step 4: Test the Integration

1. **Open Your Component**: Navigate to the page containing your AI Sales Assistant Pro v2 component
2. **Click Settings**: Click the three dots (⋮) next to the component title
3. **Enter Test Context**: Add some business context like:
   ```
   We are a manufacturing company specializing in automotive parts. 
   Our main challenges are supply chain optimization and quality control. 
   We're looking to improve our customer service and reduce response times.
   ```
4. **Generate Content**: Click "Generate Content" button
5. **Verify Results**: You should see custom content generated based on your context

## Step 5: Troubleshooting

### Common Issues and Solutions:

**"API key not configured" Error**
- Ensure you've saved the API key in the Custom Metadata Type
- Verify the API key doesn't have extra spaces or characters
- Check that the record name is exactly "Hugging_Face_Config"

**"API call failed: 401" Error**
- Your API key may be invalid or expired
- Generate a new API key from Hugging Face
- Ensure you copied the complete token

**"API call failed: 429" Error**
- You've hit the rate limit (free tier has limits)
- Wait a few minutes and try again
- Consider upgrading to Hugging Face Pro if you need higher limits

**Generic Content Instead of Custom**
- The AI integration is working, but may fall back to templates
- Try more specific context descriptions
- Include company names, specific products, or industry details

## API Key Security Best Practices

1. **Never share your API key** in emails, chat, or code repositories
2. **Use Custom Metadata Types** (as implemented) for secure storage
3. **Rotate keys regularly** if you suspect they may be compromised
4. **Monitor usage** in your Hugging Face account dashboard

## Free Tier Limitations

- **Rate Limits**: Limited requests per minute/hour
- **Model Access**: Access to most models including the one we use (FLAN-T5-Large)
- **Usage Quotas**: Generous monthly quotas for most use cases

## Upgrade Options

If you need higher limits:
1. **Hugging Face Pro**: $9/month for higher rate limits
2. **Hugging Face Enterprise**: Custom pricing for enterprise needs

## Component Features Once Configured

With the API key configured, your component will:
- Generate truly custom content based on your business context
- Create industry-specific scenarios and priorities
- Reference specific details from your context input
- Provide relevant ROI and business impact examples
- Maintain fallback to template content if AI service is unavailable

## Support

- **Hugging Face Documentation**: [https://huggingface.co/docs](https://huggingface.co/docs)
- **API Documentation**: [https://huggingface.co/docs/api-inference](https://huggingface.co/docs/api-inference)
- **Community Support**: [https://discuss.huggingface.co](https://discuss.huggingface.co)

---

## Quick Setup Checklist

- [ ] Create Hugging Face account
- [ ] Generate API token with "Read" permissions
- [ ] Copy the token
- [ ] Navigate to Setup → Custom Metadata Types
- [ ] Edit "Hugging Face Config" record
- [ ] Replace "PLACEHOLDER_API_KEY" with your token
- [ ] Save the record
- [ ] Test the component with business context
- [ ] Verify custom content generation

**Your AI Sales Assistant Pro v2 component is now ready to generate custom, contextual content!** 