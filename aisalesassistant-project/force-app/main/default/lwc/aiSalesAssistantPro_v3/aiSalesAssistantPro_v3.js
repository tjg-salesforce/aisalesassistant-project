import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import generateAIContent from '@salesforce/apex/AIContentGeneratorService.generateAIContent';
import getCurrentConfig from '@salesforce/apex/AISalesAssistantConfigService.getCurrentConfig';
import saveAIContent from '@salesforce/apex/AISalesAssistantConfigService.saveAIContent';
// import updateContentItem from '@salesforce/apex/AISalesAssistantConfigService.updateContentItem'; // For future inline editing
import resetToDefaults from '@salesforce/apex/AISalesAssistantConfigService.resetToDefaults';

export default class AiSalesAssistantPro_v3 extends NavigationMixin(LightningElement) {
    
    // Component state - all configurable via internal settings panel
    @track componentSettings = {
        title: 'AI Sales Assistant Pro v3',
        welcomeMessage: 'Hi there, here\'s your AI-powered sales overview:',
        infoMessage: 'Managing 2x more accounts this quarter. AI has analyzed your portfolio to help you prioritize.',
        showInfoSection: false,
        buttonColor: '#0576D3',
        primaryVertical: 'Manufacturing',
        subVertical: 'Discrete - OEM', 
        customerType: 'B2B',
        showSiteVisitsSection: false
    };
    
    // Section configuration
    @track sectionConfig = {
        noTouch: {
            title: 'AI Completed Actions (No Touch)',
            icon: 'utility:announcement'
        },
        lowTouch: {
            title: 'Recommended Actions (Low Touch)', 
            icon: 'utility:check'
        },
        highTouch: {
            title: 'Priority Focus (High Touch)',
            icon: 'utility:high_velocity_sales'
        },
        siteVisits: {
            title: 'Site Visits',
            icon: 'utility:location'
        }
    };
    
    // Content data from Custom Object or defaults
    @track contentData = {
        noTouch: [],
        lowTouch: [],
        highTouch: [],
        siteVisits: []
    };
    
    // UI state
    @track showInfoBox = false;
    @track showSettingsModal = false;
    @track showComponentSettingsModal = false;
    @track customerContext = '';
    @track componentContext = 'This AI Sales Assistant demonstrates how artificial intelligence enhances sales rep efficiency through three strategic categories:\n\n• NO TOUCH: AI automatically executes actions across systems on behalf of sales reps, eliminating manual tasks\n• LOW TOUCH: AI identifies and automates repetitive manual actions in bulk, enabling quick batch processing\n• HIGH TOUCH: AI provides key insights to focus manual effort on growth opportunities, efficiency improvements, and strategic initiatives\n\nThe goal is to show customers how AI transforms sales productivity by intelligently prioritizing work and automating routine tasks.';
    @track isGenerating = false;
    @track generationProgress = 0;
    @track generationStatus = '';
    @track isBackgroundProcessing = false;
    
    // Configuration status
    @track hasCustomContent = false;
    @track configInfo = null;
    
    // Future: Inline editing functionality will be added in next version
    
    // Lifecycle
    async connectedCallback() {
        await this.loadConfiguration();
        this.updateButtonColor();
    }
    
    renderedCallback() {
        this.updateButtonColor();
        this.renderHtmlContent();
    }
    
    // Configuration loading
    async loadConfiguration() {
        try {
            const config = await getCurrentConfig();
            this.configInfo = config;
            this.hasCustomContent = config.hasCustomContent;
            
            if (config.hasCustomContent && config.contentData) {
                this.contentData = config.contentData;
                console.log('✅ Loaded custom configuration from org storage');
            } else {
                this.loadDefaultContent();
                console.log('📋 Using default content - no custom configuration found');
            }
            
        } catch (error) {
            console.error('Error loading configuration:', error);
            this.loadDefaultContent();
            this.showToast('Warning', 'Could not load saved configuration, using defaults', 'warning');
        }
    }
    
    loadDefaultContent() {
        // Load default industry-specific content based on component settings
        const vertical = this.componentSettings.primaryVertical;
        const subVertical = this.componentSettings.subVertical;
        const customerType = this.componentSettings.customerType;
        
        this.contentData = this.getIndustryContent(vertical, subVertical, customerType);
    }
    
    // AI Content Generation
    async handleGenerateContent() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.generationProgress = 0;
        this.generationStatus = 'Initializing AI analysis...';
        
        try {
            // Progress simulation
            this.updateProgress(20, 'Analyzing customer context...');
            await this.delay(800);
            
            this.updateProgress(50, 'Identifying industry patterns...');
            await this.delay(600);
            
            this.updateProgress(80, 'Generating personalized content...');
            
            // Generate AI content
            const aiContent = await generateAIContent({
                customerContext: this.customerContext,
                componentContext: this.componentContext
            });
            
            this.updateProgress(95, 'Finalizing content...');
            await this.delay(300);
            
            if (aiContent && aiContent.success && aiContent.content) {
                await this.saveGeneratedContent(aiContent.content);
                this.updateProgress(100, 'Content generation complete!');
                await this.delay(500);
                
                this.showToast('Success', 'AI content generated and saved automatically!', 'success');
            } else {
                throw new Error(aiContent?.error || 'Unknown error generating content');
            }
            
        } catch (error) {
            console.error('AI generation error:', error);
            this.showToast('Generation Error', 'Could not generate AI content: ' + error.message, 'error');
        } finally {
            this.isGenerating = false;
            this.generationProgress = 0;
            this.generationStatus = '';
            this.handleSettingsClose();
        }
    }
    
    async saveGeneratedContent(content) {
        try {
            const contentJson = JSON.stringify(content);
            const configId = await saveAIContent({ contentJson });
            
            // Update local state
            this.contentData = content;
            this.hasCustomContent = true;
            
            // Reload configuration info
            await this.loadConfiguration();
            
            console.log('✅ AI content saved to org storage with ID:', configId);
            
        } catch (error) {
            console.error('Error saving generated content:', error);
            throw new Error('Failed to save generated content: ' + error.message);
        }
    }
    
    // Future: Inline editing methods will be added in next version
    
    // Reset functionality
    async handleResetToDefaults() {
        try {
            await resetToDefaults();
            await this.loadConfiguration();
            this.showToast('Reset Complete', 'Configuration reset to defaults', 'success');
            this.handleSettingsClose();
        } catch (error) {
            console.error('Error resetting:', error);
            this.showToast('Reset Error', 'Could not reset configuration: ' + error.message, 'error');
        }
    }
    
    // Settings and UI handlers
    handleSettingsClick() {
        this.showSettingsModal = true;
    }
    
    handleSettingsClose() {
        this.showSettingsModal = false;
    }
    
    handleComponentSettingsClick() {
        this.showComponentSettingsModal = true;
    }
    
    handleComponentSettingsClose() {
        this.showComponentSettingsModal = false;
    }
    
    handleModalClick(event) {
        // Prevent modal from closing when clicking inside the modal content
        event.stopPropagation();
    }
    
    handleCustomerContextChange(event) {
        this.customerContext = event.target.value;
    }
    
    handleComponentContextChange(event) {
        this.componentContext = event.target.value;
    }
    
    handleInfoToggle() {
        this.showInfoBox = !this.showInfoBox;
    }
    
    // Navigation and actions
    handleItemClick(event) {
        const itemId = event.currentTarget.dataset.itemId;
        const item = this.template.querySelector(`[data-item-id="${itemId}"]`);
        if (item) {
            const details = item.querySelector('.item-details');
            if (details) {
                const isExpanded = details.style.display !== 'none';
                details.style.display = isExpanded ? 'none' : 'block';
            }
        }
    }
    
    handleButtonClick(event) {
        const url = event.target.dataset.url;
        if (url && url !== '#') {
            this.navigateToUrl(url);
        }
    }
    
    navigateToUrl(url) {
        try {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                window.open(url, '_blank');
            } else {
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: { url: url }
                });
            }
        } catch (error) {
            console.error('Navigation error:', error);
            this.showToast('Navigation Error', 'Could not navigate to URL', 'error');
        }
    }
    
    // Utility methods
    updateButtonColor() {
        if (this.template.host) {
            const color = this.componentSettings.buttonColor;
            this.template.host.style.setProperty('--button-color', color);
            this.template.host.style.setProperty('--button-color-hover', this.darkenColor(color, 20));
            this.template.host.style.setProperty('--button-color-active', this.darkenColor(color, 30));
        }
    }
    
    darkenColor(hex, percent) {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    updateProgress(progress, status) {
        this.generationProgress = progress;
        this.generationStatus = status;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    renderHtmlContent() {
        // Render any HTML content in detail sections
        const detailElements = this.template.querySelectorAll('.detail-content');
        detailElements.forEach(element => {
            const content = element.dataset.content;
            if (content && content.includes('<')) {
                element.innerHTML = this.sanitizeHtml(content);
            }
        });
    }
    
    sanitizeHtml(html) {
        const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'li', 'ol', 'h3', 'h4', 'h5', 'h6', 'div', 'span'];
        // Basic sanitization - in production, use a proper HTML sanitizer
        return html.replace(/<(?!\/?(${allowedTags.join('|')})\s*\/?)[^>]+>/gi, '');
    }
    
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    
    // Default content based on industry
    getIndustryContent(vertical, subVertical, customerType) {
        // This would include the same industry-specific content generation logic
        // from the original component but simplified for the self-contained approach
        return {
            noTouch: [
                {
                    title: 'Automated Lead Scoring',
                    description: 'AI automatically scored 127 new leads based on engagement patterns',
                    icon: 'utility:success',
                    buttonLabel: 'View Scores',
                    buttonLink: '#',
                    detailTitle: 'Lead Scoring Analysis',
                    detailContent: '<p>AI analyzed engagement patterns and automatically scored leads.</p>',
                    showButton: true
                }
            ],
            lowTouch: [
                {
                    title: 'Email Follow-up Recommendations',
                    description: 'Review 15 AI-suggested follow-up emails for warm prospects',
                    icon: 'utility:email',
                    buttonLabel: 'Review Emails',
                    buttonLink: '#',
                    detailTitle: 'Email Suggestions',
                    detailContent: '<p>AI generated personalized follow-up email templates.</p>',
                    showButton: true
                }
            ],
            highTouch: [
                {
                    title: 'Strategic Account Planning',
                    description: 'Schedule deep-dive meeting with Enterprise prospect',
                    icon: 'utility:opportunity',
                    buttonLabel: 'Schedule Meeting',
                    buttonLink: '#',
                    detailTitle: 'Account Strategy',
                    detailContent: '<p>This prospect requires personalized strategic approach.</p>',
                    showButton: true
                }
            ],
            siteVisits: []
        };
    }
    
    // Computed properties
    get processedButtonColor() {
        let color = this.componentSettings.buttonColor;
        if (color && !color.startsWith('#')) {
            color = '#' + color;
        }
        return color || '#0576D3';
    }
    
    get buttonStyle() {
        return `background-color: ${this.processedButtonColor} !important; border-color: ${this.processedButtonColor} !important;`;
    }
    
    get progressBarStyle() {
        return `width: ${this.generationProgress}%; background-color: ${this.processedButtonColor}; transition: width 0.3s ease;`;
    }
    
    get noTouchItems() {
        return this.contentData.noTouch || [];
    }
    
    get lowTouchItems() {
        return this.contentData.lowTouch || [];
    }
    
    get highTouchItems() {
        return this.contentData.highTouch || [];
    }
    
    get siteVisitItems() {
        return this.contentData.siteVisits || [];
    }
    
    get showSiteVisits() {
        return this.componentSettings.showSiteVisitsSection && this.siteVisitItems.length > 0;
    }
    
    get configStatusMessage() {
        if (!this.configInfo) return 'Loading configuration...';
        
        if (this.hasCustomContent) {
            const lastModified = new Date(this.configInfo.lastModifiedDate).toLocaleDateString();
            return `Using custom AI content (last updated: ${lastModified})`;
        } else {
            return 'Using default content';
        }
    }
    

} 