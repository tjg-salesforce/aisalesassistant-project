import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import generateAIContent from '@salesforce/apex/AIContentGeneratorService.generateAIContent';

export default class AiSalesAssistantPro_v2 extends NavigationMixin(LightningElement) {
    // Design attributes - Component Settings
    @api componentTitle = 'AI Sales Assistant Pro v2';
    @api welcomeMessage = 'Hi there, here\'s your AI-powered sales overview:';
    @api infoMessage = 'Managing 2x more accounts this quarter. AI has analyzed your portfolio to help you prioritize.';
    @api showInfoSection = false;
    @api buttonColor = '0576D3';
    
    // Design attributes - Vertical Configuration
    @api primaryVertical = 'Manufacturing';
    @api subVertical = 'Discrete - OEM';
    @api customerType = 'B2B';
    
    // Design attributes - Section Controls
    @api showSiteVisitsSection = false;
    
    // Design attributes - Section Headers
    @api noTouchSectionTitle = 'AI Completed Actions (No Touch)';
    @api noTouchSectionIcon = 'utility:announcement';
    @api lowTouchSectionTitle = 'Recommended Actions (Low Touch)';
    @api lowTouchSectionIcon = 'utility:check';
    @api highTouchSectionTitle = 'Priority Focus (High Touch)';
    @api highTouchSectionIcon = 'utility:high_velocity_sales';
    @api siteVisitsSectionTitle = 'Site Visits';
    @api siteVisitsSectionIcon = 'utility:location';
    
    // Design attributes - No Touch Items
    @api noTouch1Title = '';
    @api noTouch1Desc = '';
    @api noTouch1Icon = 'utility:success';
    @api noTouch1ButtonLabel = 'View Report';
    @api noTouch1ButtonLink = '';
    @api noTouch1DetailTitle = '';
    @api noTouch1DetailContent = '';
    
    @api noTouch2Title = '';
    @api noTouch2Desc = '';
    @api noTouch2Icon = 'utility:email';
    @api noTouch2ButtonLabel = 'View Alerts';
    @api noTouch2ButtonLink = '';
    @api noTouch2DetailTitle = '';
    @api noTouch2DetailContent = '';
    
    @api noTouch3Title = '';
    @api noTouch3Desc = '';
    @api noTouch3Icon = 'utility:knowledge_base';
    @api noTouch3ButtonLabel = 'View Analysis';
    @api noTouch3ButtonLink = '';
    @api noTouch3DetailTitle = '';
    @api noTouch3DetailContent = '';
    
    // Design attributes - Low Touch Items
    @api lowTouch1Title = '';
    @api lowTouch1Desc = '';
    @api lowTouch1Icon = 'utility:priority';
    @api lowTouch1ButtonLabel = '';
    @api lowTouch1ButtonLink = '';
    @api lowTouch1DetailTitle = '';
    @api lowTouch1DetailContent = '';
    
    @api lowTouch2Title = '';
    @api lowTouch2Desc = '';
    @api lowTouch2Icon = 'utility:approval';
    @api lowTouch2ButtonLabel = '';
    @api lowTouch2ButtonLink = '';
    @api lowTouch2DetailTitle = '';
    @api lowTouch2DetailContent = '';
    
    @api lowTouch3Title = '';
    @api lowTouch3Desc = '';
    @api lowTouch3Icon = 'utility:groups';
    @api lowTouch3ButtonLabel = '';
    @api lowTouch3ButtonLink = '';
    @api lowTouch3DetailTitle = '';
    @api lowTouch3DetailContent = '';
    
    // Design attributes - High Touch Items
    @api highTouch1Title = '';
    @api highTouch1Desc = '';
    @api highTouch1Icon = 'utility:opportunity';
    @api highTouch1ButtonLabel = '';
    @api highTouch1ButtonLink = '';
    @api highTouch1DetailTitle = '';
    @api highTouch1DetailContent = '';
    
    @api highTouch2Title = '';
    @api highTouch2Desc = '';
    @api highTouch2Icon = 'utility:warning';
    @api highTouch2ButtonLabel = '';
    @api highTouch2ButtonLink = '';
    @api highTouch2DetailTitle = '';
    @api highTouch2DetailContent = '';
    
    @api highTouch3Title = '';
    @api highTouch3Desc = '';
    @api highTouch3Icon = 'utility:user';
    @api highTouch3ButtonLabel = '';
    @api highTouch3ButtonLink = '';
    @api highTouch3DetailTitle = '';
    @api highTouch3DetailContent = '';
    
    // Design attributes - Site Visits Items
    @api siteVisits1Title = '';
    @api siteVisits1Desc = '';
    @api siteVisits1Icon = 'utility:location';
    @api siteVisits1ButtonLabel = '';
    @api siteVisits1ButtonLink = '';
    @api siteVisits1DetailTitle = '';
    @api siteVisits1DetailContent = '';
    
    @api siteVisits2Title = '';
    @api siteVisits2Desc = '';
    @api siteVisits2Icon = 'utility:location';
    @api siteVisits2ButtonLabel = '';
    @api siteVisits2ButtonLink = '';
    @api siteVisits2DetailTitle = '';
    @api siteVisits2DetailContent = '';
    
    @api siteVisits3Title = '';
    @api siteVisits3Desc = '';
    @api siteVisits3Icon = 'utility:location';
    @api siteVisits3ButtonLabel = '';
    @api siteVisits3ButtonLink = '';
    @api siteVisits3DetailTitle = '';
    @api siteVisits3DetailContent = '';

    // Internal state for UI
    @track contentData = {
        noTouch: [],
        lowTouch: [],
        highTouch: [],
        siteVisits: []
    };
    
    @track showInfoBox = false;
    
    // Settings modal state
    @track showSettingsModal = false;
    @track customerContext = '';
    @track componentContext = 'This AI Sales Assistant demonstrates how artificial intelligence enhances sales rep efficiency through three strategic categories:\n\n• NO TOUCH: AI automatically executes actions across systems on behalf of sales reps, eliminating manual tasks\n• LOW TOUCH: AI identifies and automates repetitive manual actions in bulk, enabling quick batch processing\n• HIGH TOUCH: AI provides key insights to focus manual effort on growth opportunities, efficiency improvements, and strategic initiatives\n\nThe goal is to show customers how AI transforms sales productivity by intelligently prioritizing work and automating routine tasks.';
    @track isGenerating = false;
    @track generationProgress = 0;
    @track generationStatus = '';
    @track isBackgroundProcessing = false;

    // Add property to track if AI content is active
    @track hasAIContent = false;

    // Add property to track copy modal
    @track showCopyModal = false;
    
    // Add properties for inline editing
    @track editMode = false;
    @track editingItem = null;
    @track hasUnsavedChanges = false;

    // Lifecycle
    connectedCallback() {
        // First try to load persisted AI content, fallback to design attributes
        if (!this.loadPersistedAIContent()) {
            this.loadContentFromDesignAttributes();
        }
        this.loadHiddenState();
        this.updateButtonColor();
        
        // Check persistence health for demo org scenarios
        const healthCheck = this.checkPersistenceHealth();
        if (healthCheck.status === 'warning') {
            console.warn(`⚠️ ${healthCheck.message} - ${healthCheck.recommendation}`);
        } else if (healthCheck.status === 'info') {
            console.log(`ℹ️ ${healthCheck.message}`);
        }
    }
    
    renderedCallback() {
        this.updateButtonColor();
        this.renderHtmlContent();
    }
    
    updateButtonColor() {
        // Set CSS custom property for dynamic button color
        if (this.template.host) {
            console.log('Setting button color:', this.processedButtonColor);
            this.template.host.style.setProperty('--button-color', this.processedButtonColor);
            
            // Calculate darker shades for hover and active states
            const baseColor = this.processedButtonColor;
            const hoverColor = this.darkenColor(baseColor, 20);
            const activeColor = this.darkenColor(baseColor, 30);
            
            this.template.host.style.setProperty('--button-color-hover', hoverColor);
            this.template.host.style.setProperty('--button-color-active', activeColor);
            
            console.log('CSS custom properties set:', {
                '--button-color': this.processedButtonColor,
                '--button-color-hover': hoverColor,
                '--button-color-active': activeColor
            });
        }
    }





    // Helper method to darken a hex color
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

    renderHtmlContent() {
        // Find all manual DOM elements and populate with HTML content
        const detailElements = this.template.querySelectorAll('.detail-content');
        
        detailElements.forEach(element => {
            const itemDetails = element.closest('.item-details');
            if (itemDetails) {
                const contentItem = itemDetails.closest('.content-item');
                const sectionElement = contentItem.closest('.section');
                
                // Determine which section this element belongs to
                let sectionName = '';
                if (sectionElement.classList.contains('no-touch-section')) {
                    sectionName = 'noTouch';
                } else if (sectionElement.classList.contains('low-touch-section')) {
                    sectionName = 'lowTouch';
                } else if (sectionElement.classList.contains('high-touch-section')) {
                    sectionName = 'highTouch';
                } else if (sectionElement.classList.contains('site-visits-section')) {
                    sectionName = 'siteVisits';
                }
                
                // Find the item index
                const allItems = sectionElement.querySelectorAll('.content-item');
                const itemIndex = Array.from(allItems).indexOf(contentItem);
                
                // Get the content data and render HTML
                if (sectionName && itemIndex >= 0) {
                    const sectionData = this.contentData[sectionName];
                    if (sectionData && sectionData[itemIndex]) {
                        const htmlContent = sectionData[itemIndex].detailContent || '';
                        // Always render HTML content (visibility is controlled by if:true in template)
                        element.innerHTML = this.sanitizeHtml(htmlContent);
                    }
                }
            }
        });
    }

    sanitizeHtml(html) {
        // Basic HTML sanitization - remove script tags and potentially dangerous attributes
        if (!html) return '';
        
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
            .replace(/on\w+\s*=\s*'[^']*'/gi, '')
            .replace(/javascript:/gi, '');
    }

    // Load hidden state from localStorage
    loadHiddenState() {
        try {
            const hiddenItems = JSON.parse(localStorage.getItem('aiSalesAssistant_hiddenItems') || '[]');
            
            // Apply hidden state to content data
            hiddenItems.forEach(itemId => {
                const [section, index] = itemId.split('_');
                if (this.contentData[section] && this.contentData[section][index]) {
                    this.contentData[section][index].hidden = true;
                }
            });
        } catch (error) {
            console.error('Error loading hidden state:', error);
        }
    }

    // Save hidden state to localStorage
    saveHiddenState() {
        try {
            const hiddenItems = [];
            
            // Collect all hidden items
            Object.keys(this.contentData).forEach(section => {
                this.contentData[section].forEach((item, index) => {
                    if (item.hidden) {
                        hiddenItems.push(`${section}_${index}`);
                    }
                });
            });
            
            localStorage.setItem('aiSalesAssistant_hiddenItems', JSON.stringify(hiddenItems));
        } catch (error) {
            console.error('Error saving hidden state:', error);
        }
    }

    // Clear all hidden state and refresh component
    handleRefresh() {
        try {
            // Clear localStorage
            localStorage.removeItem('aiSalesAssistant_hiddenItems');
            
            // Reset all items to visible
            Object.keys(this.contentData).forEach(section => {
                this.contentData[section].forEach(item => {
                    item.hidden = false;
                    item.expanded = false; // Also collapse all expanded items
                });
            });
        } catch (error) {
            console.error('Error refreshing component:', error);
        }
    }

    // Handle keyboard events for refresh section accessibility
    handleRefreshKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.handleRefresh();
        }
    }

    // Load content from design attributes instead of dynamic generation
    loadContentFromDesignAttributes() {
        this.contentData = {
            noTouch: [
                {
                    title: this.noTouch1Title || this.getDefaultContent('noTouch', 1, 'title'),
                    description: this.noTouch1Desc || this.getDefaultContent('noTouch', 1, 'description'),
                    icon: this.noTouch1Icon,
                    buttonLabel: this.noTouch1ButtonLabel,
                    buttonLink: this.noTouch1ButtonLink,
                    showButton: true,
                    detailTitle: this.noTouch1DetailTitle || this.getDefaultContent('noTouch', 1, 'detailTitle'),
                    detailContent: this.noTouch1DetailContent || this.getDefaultContent('noTouch', 1, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.noTouch2Title || this.getDefaultContent('noTouch', 2, 'title'),
                    description: this.noTouch2Desc || this.getDefaultContent('noTouch', 2, 'description'),
                    icon: this.noTouch2Icon,
                    buttonLabel: this.noTouch2ButtonLabel,
                    buttonLink: this.noTouch2ButtonLink,
                    showButton: true,
                    detailTitle: this.noTouch2DetailTitle || this.getDefaultContent('noTouch', 2, 'detailTitle'),
                    detailContent: this.noTouch2DetailContent || this.getDefaultContent('noTouch', 2, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.noTouch3Title || this.getDefaultContent('noTouch', 3, 'title'),
                    description: this.noTouch3Desc || this.getDefaultContent('noTouch', 3, 'description'),
                    icon: this.noTouch3Icon,
                    buttonLabel: this.noTouch3ButtonLabel,
                    buttonLink: this.noTouch3ButtonLink,
                    showButton: true,
                    detailTitle: this.noTouch3DetailTitle || this.getDefaultContent('noTouch', 3, 'detailTitle'),
                    detailContent: this.noTouch3DetailContent || this.getDefaultContent('noTouch', 3, 'detailContent'),
                    expanded: false,
                    hidden: false
                }
            ],
            lowTouch: [
                {
                    title: this.lowTouch1Title || this.getDefaultContent('lowTouch', 1, 'title'),
                    description: this.lowTouch1Desc || this.getDefaultContent('lowTouch', 1, 'description'),
                    icon: this.lowTouch1Icon,
                    buttonLabel: this.lowTouch1ButtonLabel || this.getDefaultContent('lowTouch', 1, 'buttonLabel'),
                    buttonLink: this.lowTouch1ButtonLink,
                    showButton: true,
                    detailTitle: this.lowTouch1DetailTitle || this.getDefaultContent('lowTouch', 1, 'detailTitle'),
                    detailContent: this.lowTouch1DetailContent || this.getDefaultContent('lowTouch', 1, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.lowTouch2Title || this.getDefaultContent('lowTouch', 2, 'title'),
                    description: this.lowTouch2Desc || this.getDefaultContent('lowTouch', 2, 'description'),
                    icon: this.lowTouch2Icon,
                    buttonLabel: this.lowTouch2ButtonLabel || this.getDefaultContent('lowTouch', 2, 'buttonLabel'),
                    buttonLink: this.lowTouch2ButtonLink,
                    showButton: true,
                    detailTitle: this.lowTouch2DetailTitle || this.getDefaultContent('lowTouch', 2, 'detailTitle'),
                    detailContent: this.lowTouch2DetailContent || this.getDefaultContent('lowTouch', 2, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.lowTouch3Title || this.getDefaultContent('lowTouch', 3, 'title'),
                    description: this.lowTouch3Desc || this.getDefaultContent('lowTouch', 3, 'description'),
                    icon: this.lowTouch3Icon,
                    buttonLabel: this.lowTouch3ButtonLabel || this.getDefaultContent('lowTouch', 3, 'buttonLabel'),
                    buttonLink: this.lowTouch3ButtonLink,
                    showButton: true,
                    detailTitle: this.lowTouch3DetailTitle || this.getDefaultContent('lowTouch', 3, 'detailTitle'),
                    detailContent: this.lowTouch3DetailContent || this.getDefaultContent('lowTouch', 3, 'detailContent'),
                    expanded: false,
                    hidden: false
                }
            ],
            highTouch: [
                {
                    title: this.highTouch1Title || this.getDefaultContent('highTouch', 1, 'title'),
                    description: this.highTouch1Desc || this.getDefaultContent('highTouch', 1, 'description'),
                    icon: this.highTouch1Icon,
                    buttonLabel: this.highTouch1ButtonLabel || this.getDefaultContent('highTouch', 1, 'buttonLabel'),
                    buttonLink: this.highTouch1ButtonLink,
                    showButton: true,
                    detailTitle: this.highTouch1DetailTitle || this.getDefaultContent('highTouch', 1, 'detailTitle'),
                    detailContent: this.highTouch1DetailContent || this.getDefaultContent('highTouch', 1, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.highTouch2Title || this.getDefaultContent('highTouch', 2, 'title'),
                    description: this.highTouch2Desc || this.getDefaultContent('highTouch', 2, 'description'),
                    icon: this.highTouch2Icon,
                    buttonLabel: this.highTouch2ButtonLabel || this.getDefaultContent('highTouch', 2, 'buttonLabel'),
                    buttonLink: this.highTouch2ButtonLink,
                    showButton: true,
                    detailTitle: this.highTouch2DetailTitle || this.getDefaultContent('highTouch', 2, 'detailTitle'),
                    detailContent: this.highTouch2DetailContent || this.getDefaultContent('highTouch', 2, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.highTouch3Title || this.getDefaultContent('highTouch', 3, 'title'),
                    description: this.highTouch3Desc || this.getDefaultContent('highTouch', 3, 'description'),
                    icon: this.highTouch3Icon,
                    buttonLabel: this.highTouch3ButtonLabel || this.getDefaultContent('highTouch', 3, 'buttonLabel'),
                    buttonLink: this.highTouch3ButtonLink,
                    showButton: true,
                    detailTitle: this.highTouch3DetailTitle || this.getDefaultContent('highTouch', 3, 'detailTitle'),
                    detailContent: this.highTouch3DetailContent || this.getDefaultContent('highTouch', 3, 'detailContent'),
                    expanded: false,
                    hidden: false
                }
            ],
            siteVisits: [
                {
                    title: this.siteVisits1Title || this.getDefaultContent('siteVisits', 1, 'title'),
                    description: this.siteVisits1Desc || this.getDefaultContent('siteVisits', 1, 'description'),
                    icon: this.siteVisits1Icon,
                    buttonLabel: this.siteVisits1ButtonLabel || this.getDefaultContent('siteVisits', 1, 'buttonLabel'),
                    buttonLink: this.siteVisits1ButtonLink,
                    showButton: true,
                    detailTitle: this.siteVisits1DetailTitle || this.getDefaultContent('siteVisits', 1, 'detailTitle'),
                    detailContent: this.siteVisits1DetailContent || this.getDefaultContent('siteVisits', 1, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.siteVisits2Title || this.getDefaultContent('siteVisits', 2, 'title'),
                    description: this.siteVisits2Desc || this.getDefaultContent('siteVisits', 2, 'description'),
                    icon: this.siteVisits2Icon,
                    buttonLabel: this.siteVisits2ButtonLabel || this.getDefaultContent('siteVisits', 2, 'buttonLabel'),
                    buttonLink: this.siteVisits2ButtonLink,
                    showButton: true,
                    detailTitle: this.siteVisits2DetailTitle || this.getDefaultContent('siteVisits', 2, 'detailTitle'),
                    detailContent: this.siteVisits2DetailContent || this.getDefaultContent('siteVisits', 2, 'detailContent'),
                    expanded: false,
                    hidden: false
                },
                {
                    title: this.siteVisits3Title || this.getDefaultContent('siteVisits', 3, 'title'),
                    description: this.siteVisits3Desc || this.getDefaultContent('siteVisits', 3, 'description'),
                    icon: this.siteVisits3Icon,
                    buttonLabel: this.siteVisits3ButtonLabel || this.getDefaultContent('siteVisits', 3, 'buttonLabel'),
                    buttonLink: this.siteVisits3ButtonLink,
                    showButton: true,
                    detailTitle: this.siteVisits3DetailTitle || this.getDefaultContent('siteVisits', 3, 'detailTitle'),
                    detailContent: this.siteVisits3DetailContent || this.getDefaultContent('siteVisits', 3, 'detailContent'),
                    expanded: false,
                    hidden: false
                }
            ]
        };
    }

    // Get default content based on vertical/subvertical/customer type
    getDefaultContent(section, itemIndex, field) {
        const contentKey = `${this.primaryVertical}_${this.subVertical}_${this.customerType}`;
        console.log('Loading default content for:', contentKey);
        
        // Get industry-specific content or fallback to base content
        const content = this.getIndustryContent(this.primaryVertical, this.subVertical, this.customerType);
        
        if (content[section] && content[section][itemIndex - 1]) {
            return content[section][itemIndex - 1][field] || '';
        }
        
        return '';
    }

    // Industry-specific content for all verticals
    getIndustryContent(vertical, subVertical, customerType) {
        if (vertical === 'Manufacturing') {
            return {
                noTouch: [
                    {
                        title: 'Supplier outreach completed',
                        description: 'AI contacted 45 suppliers about new RFQ opportunities',
                        buttonLabel: 'View RFQ Report',
                        buttonLink: '/lightning/r/RFQ_Report__c/RFQ_External_ID__c/RFQ-2024-001/view',
                        detailTitle: 'Supplier Engagement Results',
                        detailContent: '<p>AI identified <strong>45 suppliers</strong> for new component sourcing opportunities.</p><ul><li>Automated RFQ requests sent with technical specifications</li><li>15 suppliers responded with quotes</li><li>8 requested technical clarifications</li><li>Average quoted lead time: <em>12 weeks</em></li></ul>'
                    },
                    {
                        title: 'Price variance alerts sent',
                        description: 'AI notified 23 suppliers about material cost fluctuations',
                        buttonLabel: 'View Price Alerts',
                        buttonLink: '/lightning/r/Price_Alert__c/Alert_External_ID__c/ALERT-2024-MAT-001/view',
                        detailTitle: 'Material Cost Monitoring',
                        detailContent: '<p>AI detected significant price changes in <strong>steel and aluminum markets</strong>.</p><p><span style="color: #28a745;">✓ 12 suppliers confirmed price holds</span><br><span style="color: #ffc107;">⚠ 11 requested contract renegotiation</span></p><p><strong>Risk assessment:</strong> <span style="color: #dc3545;">$340K potential cost impact</span></p>'
                    },
                    {
                        title: 'Production schedule updated',
                        description: 'AI adjusted delivery commitments based on capacity constraints',
                        buttonLabel: 'View Schedule',
                        detailTitle: 'Production Optimization',
                        detailContent: 'AI analyzed production capacity and adjusted delivery schedules for 18 active orders. Identified bottlenecks in machining center availability. Automatically communicated revised timelines to customers. Customer satisfaction maintained at 94%.'
                    }
                ],
                lowTouch: [
                    {
                        title: 'Approve supplier audit',
                        description: 'AI scheduled quality audits for 8 critical suppliers',
                        buttonLabel: 'Review Audit Plan',
                        detailTitle: 'Supplier Quality Assurance',
                        detailContent: 'AI identified 8 suppliers requiring quality audits based on performance metrics. Audit schedule prepared with compliance checklists and evaluation criteria. Estimated cost savings: $180K annually through improved quality.'
                    },
                    {
                        title: 'Review capacity contracts',
                        description: 'AI analyzed 12 supplier agreements for capacity optimization',
                        buttonLabel: 'Review Contracts',
                        detailTitle: 'Capacity Planning Analysis',
                        detailContent: 'AI reviewed supplier capacity agreements and identified optimization opportunities. 12 contracts analyzed for volume commitments and pricing tiers. Recommended adjustments could reduce costs by 15% while maintaining supply security.'
                    },
                    {
                        title: 'Schedule lean training',
                        description: 'AI identified 15 suppliers for lean manufacturing training',
                        buttonLabel: 'Plan Training',
                        detailTitle: 'Supplier Development Program',
                        detailContent: 'AI evaluated supplier efficiency metrics and identified 15 candidates for lean training program. Training modules: waste reduction, process optimization, quality improvement. Expected efficiency gains: 22% average improvement.'
                    }
                ],
                highTouch: [
                    {
                        title: 'Strategic supplier partnership',
                        description: 'Global Components Inc evaluating exclusive supply agreement',
                        buttonLabel: 'Review Partnership',
                        buttonLink: '/lightning/r/Account/External_Account_ID__c/GLOBAL-COMP-001/view',
                        detailTitle: 'Strategic Alliance Opportunity',
                        detailContent: '<div style="border-left: 4px solid #0176D3; padding-left: 12px;"><h6>Global Components Inc Profile</h6><ul><li><strong>Annual capacity:</strong> $45M</li><li><strong>Certification:</strong> ISO 9001</li><li><strong>Performance:</strong> 99.2% on-time delivery</li></ul></div><p><strong>5-Year Partnership Proposal:</strong></p><ul><li>$12M annual volume commitment</li><li>Dedicated production line</li><li>Joint R&D investment</li></ul>'
                    },
                    {
                        title: 'At-risk supplier recovery',
                        description: 'Precision Parts Ltd showing quality and delivery issues',
                        buttonLabel: 'Review Account',
                        detailTitle: 'Supplier Performance Recovery',
                        detailContent: 'Precision Parts Ltd: 8-year supplier, $2.8M annual volume, critical component supplier. Recent issues: 15% quality defect rate, 3 late deliveries, capability concerns. Recovery plan: quality improvement program, additional oversight, backup supplier activation.'
                    },
                    {
                        title: 'Executive supplier summit',
                        description: 'Top 10 suppliers invited to annual partnership meeting',
                        buttonLabel: 'Plan Summit',
                        detailTitle: 'Supplier Leadership Engagement',
                        detailContent: 'Annual supplier summit with C-level executives from top 10 suppliers. Agenda: strategic roadmap, innovation partnerships, sustainability initiatives. Combined annual spend: $85M. Objective: strengthen partnerships and align on 3-year growth strategy.'
                    }
                ],
                siteVisits: [
                    {
                        title: 'Supplier facility audit',
                        description: 'Advanced Manufacturing Corp - ISO certification and capacity assessment',
                        buttonLabel: 'Review Audit Plan',
                        detailTitle: 'Facility Qualification Assessment',
                        detailContent: 'Advanced Manufacturing Corp: New supplier, $3.2M potential annual volume, 85,000 sq ft facility. Audit scope: quality systems, production capacity, technical capabilities. Qualification requirements: ISO 9001, AS9100, statistical process control.'
                    },
                    {
                        title: 'Quality issue resolution - URGENT',
                        description: 'Precision Tools Inc - CRITICAL: 15% defect rate on key components',
                        buttonLabel: 'Review Issue',
                        detailTitle: 'Quality Crisis Response',
                        detailContent: 'CRITICAL: 15% defect rate on hydraulic components affecting production line. Precision Tools Inc: 12-year supplier, $1.8M annual volume. Immediate actions: production halt, root cause analysis, corrective action plan. Customer impact: 3-day production delay.'
                    },
                    {
                        title: 'New facility startup',
                        description: 'Global Manufacturing - Equipment installation and process validation',
                        buttonLabel: 'Review Project',
                        detailTitle: 'Facility Startup Support',
                        detailContent: 'Global Manufacturing: 125,000 sq ft new facility, $8M equipment investment, 150 employees. Startup support: process validation, quality system implementation, operator training. Timeline: 6 months to full production capability.'
                    }
                ]
            };
        }
        
        // Auto vertical content
        if (vertical === 'Auto') {
            if (subVertical === 'OEMs') {
                return {
                    noTouch: [
                        {
                            title: 'Dealer network alerts sent',
                            description: 'AI notified 127 dealers about new model availability',
                            buttonLabel: 'View Notifications',
                            detailTitle: 'Dealer Network Communication',
                            detailContent: 'AI automated launch notifications to all certified dealers about new model availability, pricing, and training requirements. 127 dealers notified, 89 confirmed receipt, 23 requested additional information.'
                        },
                        {
                            title: 'Inventory optimization completed',
                            description: 'AI adjusted production schedules based on regional demand',
                            buttonLabel: 'View Analysis',
                            detailTitle: 'Production Planning',
                            detailContent: 'AI analyzed regional sales data and adjusted production schedules for optimal inventory levels. Identified 15% reduction in carrying costs while maintaining 99.2% fill rate.'
                        },
                        {
                            title: 'Warranty claim analysis',
                            description: 'AI processed 1,247 warranty claims and identified patterns',
                            buttonLabel: 'View Report',
                            detailTitle: 'Quality Analytics',
                            detailContent: 'AI analyzed warranty claims and identified top 5 failure modes. Recommended design improvements could reduce warranty costs by 23% annually.'
                        }
                    ],
                    lowTouch: [
                        {
                            title: 'Approve incentive program',
                            description: 'AI designed dealer incentive program for Q4 launch',
                            buttonLabel: 'Review Program',
                            detailTitle: 'Dealer Incentive Strategy',
                            detailContent: 'AI analyzed market conditions and designed targeted incentive program for Q4 model launch. Projected 18% increase in dealer participation and 12% boost in launch sales.'
                        },
                        {
                            title: 'Review supplier agreements',
                            description: 'AI analyzed 34 supplier contracts for cost optimization',
                            buttonLabel: 'Review Contracts',
                            detailTitle: 'Supplier Contract Analysis',
                            detailContent: 'AI reviewed supplier agreements and identified $8.2M in potential cost savings through contract renegotiation and consolidation opportunities.'
                        },
                        {
                            title: 'Schedule training rollout',
                            description: 'AI planned technician training for new diagnostic tools',
                            buttonLabel: 'View Training Plan',
                            detailTitle: 'Technical Training Program',
                            detailContent: 'AI designed training program for new diagnostic equipment rollout. 450 technicians across 127 locations require certification. Estimated completion: 6 weeks.'
                        }
                    ],
                    highTouch: [
                        {
                            title: 'Strategic dealer partnership',
                            description: 'Metro Auto Group evaluating exclusive territory rights',
                            buttonLabel: 'Review Partnership',
                            detailTitle: 'Dealer Partnership Opportunity',
                            detailContent: 'Metro Auto Group: 12 locations, $45M annual sales, top 5% customer satisfaction. Evaluating exclusive territory rights for premium model line. 5-year commitment: $25M minimum volume.'
                        },
                        {
                            title: 'At-risk dealer recovery',
                            description: 'Coastal Motors showing declining sales and satisfaction',
                            buttonLabel: 'Review Account',
                            detailTitle: 'Dealer Performance Recovery',
                            detailContent: 'Coastal Motors: 8-year dealer, $12M annual volume, declining performance. Issues: 25% sales drop, customer satisfaction below threshold. Recovery plan: management support, marketing assistance, facility upgrade.'
                        },
                        {
                            title: 'Regional expansion meeting',
                            description: 'Top 20 dealers invited to strategic planning session',
                            buttonLabel: 'Plan Meeting',
                            detailTitle: 'Regional Strategy Summit',
                            detailContent: 'Annual regional meeting with top 20 dealers representing 65% of territory volume. Agenda: market expansion, competitive positioning, digital transformation. Combined annual sales: $230M.'
                        }
                    ],
                    siteVisits: [
                        {
                            title: 'Dealer facility audit',
                            description: 'Premium Motors - Brand compliance and facility standards',
                            buttonLabel: 'Review Audit',
                            detailTitle: 'Brand Standards Assessment',
                            detailContent: 'Premium Motors: New dealer applicant, 45,000 sq ft facility, prime location. Audit scope: brand compliance, facility standards, management capability. Investment required: $2.8M facility upgrade.'
                        },
                        {
                            title: 'Service issue resolution - URGENT',
                            description: 'City Auto Center - CRITICAL: Customer complaints about service quality',
                            buttonLabel: 'Review Issue',
                            detailTitle: 'Service Quality Crisis',
                            detailContent: 'CRITICAL: 15 customer complaints about service quality at City Auto Center. Issues: wait times, communication, pricing. Immediate action: service manager meeting, process review, customer retention plan.'
                        },
                        {
                            title: 'New showroom launch',
                            description: 'Grand Opening - AutoWorld flagship location',
                            buttonLabel: 'Review Launch',
                            detailTitle: 'Flagship Store Launch',
                            detailContent: 'AutoWorld flagship location: 62,000 sq ft showroom, 24-bay service center, $12M investment. Grand opening: customer events, media coverage, VIP reception. Projected annual volume: $35M.'
                        }
                    ]
                };
            }
            return this.getBaseContent();
        }
        
        // Energy vertical content
        if (vertical === 'Energy') {
            if (subVertical === 'Oil & Gas') {
                return {
                    noTouch: [
                        {
                            title: 'Compliance reporting completed',
                            description: 'AI generated regulatory reports for 23 facilities',
                            buttonLabel: 'View Reports',
                            detailTitle: 'Regulatory Compliance',
                            detailContent: 'AI automated compliance reporting for all facilities, ensuring 100% on-time submission to regulatory bodies. Generated 47 reports covering environmental, safety, and operational compliance.'
                        },
                        {
                            title: 'Equipment maintenance scheduled',
                            description: 'AI optimized maintenance schedules for 156 assets',
                            buttonLabel: 'View Schedule',
                            detailTitle: 'Predictive Maintenance',
                            detailContent: 'AI analyzed equipment performance data and optimized maintenance schedules. Reduced unplanned downtime by 28% while extending equipment lifecycle by 15%.'
                        },
                        {
                            title: 'Market analysis updated',
                            description: 'AI processed commodity prices and demand forecasts',
                            buttonLabel: 'View Analysis',
                            detailTitle: 'Market Intelligence',
                            detailContent: 'AI analyzed global commodity markets and updated demand forecasts. Identified 12% price increase opportunity and recommended strategic inventory adjustments.'
                        }
                    ],
                    lowTouch: [
                        {
                            title: 'Approve drilling permits',
                            description: 'AI prepared permit applications for 8 new sites',
                            buttonLabel: 'Review Applications',
                            detailTitle: 'Permit Management',
                            detailContent: 'AI completed environmental assessments and prepared permit applications for 8 new drilling sites. Estimated approval timeline: 4-6 months. Projected production: 15,000 barrels/day.'
                        },
                        {
                            title: 'Review safety protocols',
                            description: 'AI updated safety procedures based on incident analysis',
                            buttonLabel: 'Review Updates',
                            detailTitle: 'Safety Protocol Enhancement',
                            detailContent: 'AI analyzed incident data and recommended safety protocol updates. New procedures address 85% of historical incident causes. Training required for 340 field personnel.'
                        },
                        {
                            title: 'Schedule contractor evaluations',
                            description: 'AI identified 12 contractors for performance review',
                            buttonLabel: 'Review Contractors',
                            detailTitle: 'Contractor Performance Review',
                            detailContent: 'AI evaluated contractor performance metrics and identified 12 requiring formal review. Assessment criteria: safety record, quality, schedule adherence, cost control.'
                        }
                    ],
                    highTouch: [
                        {
                            title: 'Joint venture opportunity',
                            description: 'Global Energy Partners proposing offshore project',
                            buttonLabel: 'Review Proposal',
                            detailTitle: 'Strategic Partnership',
                            detailContent: 'Global Energy Partners: $2.8B joint venture proposal for offshore drilling project. 15-year commitment, 40% ownership stake, estimated reserves: 150M barrels. Due diligence phase: 6 months.'
                        },
                        {
                            title: 'Environmental compliance risk',
                            description: 'Coastal Facility showing regulatory warning signs',
                            buttonLabel: 'Review Risk',
                            detailTitle: 'Compliance Risk Management',
                            detailContent: 'Coastal Facility: 3 minor violations in past 6 months, regulatory scrutiny increasing. Risk mitigation: enhanced monitoring, staff training, process improvements. Investment required: $1.2M.'
                        },
                        {
                            title: 'Executive regulatory meeting',
                            description: 'State commission requesting industry dialogue',
                            buttonLabel: 'Schedule Meeting',
                            detailTitle: 'Regulatory Relations',
                            detailContent: 'State regulatory commission requesting industry dialogue on new environmental standards. Strategic importance: influence policy development, demonstrate leadership, protect industry interests.'
                        }
                    ],
                    siteVisits: [
                        {
                            title: 'Facility safety inspection',
                            description: 'Quarterly safety audit at Refinery Complex A',
                            buttonLabel: 'Review Inspection',
                            detailTitle: 'Safety Compliance Audit',
                            detailContent: 'Refinery Complex A: Quarterly safety inspection covering 12 process units. Scope: equipment integrity, safety systems, personnel training, emergency procedures. Compliance rating: 96.8%.'
                        },
                        {
                            title: 'Equipment failure - URGENT',
                            description: 'Production Platform 7 - CRITICAL: Compressor failure affecting output',
                            buttonLabel: 'Review Issue',
                            detailTitle: 'Critical Equipment Failure',
                            detailContent: 'CRITICAL: Main compressor failure on Production Platform 7. Impact: 8,000 barrels/day production loss. Emergency response: repair crew mobilized, backup equipment assessment, production rerouting.'
                        },
                        {
                            title: 'New field development',
                            description: 'Eagle Ford Site - Initial production setup and commissioning',
                            buttonLabel: 'Review Project',
                            detailTitle: 'Field Development Project',
                            detailContent: 'Eagle Ford Site: New field development project, 45 wells, estimated reserves: 28M barrels. Commissioning phase: equipment installation, testing, staff training. First production: Q2 target.'
                        }
                    ]
                };
            }
            return this.getBaseContent();
        }
        
        // Retail vertical content
        if (vertical === 'Retail') {
            if (customerType === 'B2B') {
                return {
                    noTouch: [
                        {
                            title: 'Inventory alerts sent',
                            description: 'AI notified 89 retailers about low stock items',
                            buttonLabel: 'View Alerts',
                            detailTitle: 'Inventory Management',
                            detailContent: 'AI monitored retailer inventory levels and sent automated alerts for items approaching stockout. 89 retailers notified, average reorder lead time: 5 days.'
                        },
                        {
                            title: 'Price optimization completed',
                            description: 'AI updated wholesale pricing for 1,247 SKUs',
                            buttonLabel: 'View Pricing',
                            detailTitle: 'Dynamic Pricing Strategy',
                            detailContent: 'AI analyzed market conditions and competitor pricing to optimize wholesale rates. Updated pricing for 1,247 SKUs resulting in 8% margin improvement.'
                        },
                        {
                            title: 'Promotional campaigns launched',
                            description: 'AI deployed targeted promotions to 156 retail partners',
                            buttonLabel: 'View Campaigns',
                            detailTitle: 'Partner Promotion Management',
                            detailContent: 'AI created and deployed personalized promotional campaigns based on retailer performance and customer demographics. 156 campaigns launched with 23% average response rate.'
                        }
                    ],
                    lowTouch: [
                        {
                            title: 'Approve merchandising plan',
                            description: 'AI designed seasonal merchandising for 45 key retailers',
                            buttonLabel: 'Review Plan',
                            detailTitle: 'Seasonal Merchandising Strategy',
                            detailContent: 'AI analyzed historical sales data and created seasonal merchandising plans for 45 key retail partners. Projected 15% increase in seasonal sales performance.'
                        },
                        {
                            title: 'Review partner agreements',
                            description: 'AI analyzed 28 retail contracts for renewal optimization',
                            buttonLabel: 'Review Contracts',
                            detailTitle: 'Partner Contract Analysis',
                            detailContent: 'AI reviewed retail partnership agreements and identified opportunities for improved terms. 28 contracts analyzed, $2.1M in potential additional revenue identified.'
                        },
                        {
                            title: 'Schedule training programs',
                            description: 'AI identified 67 retailers for product training',
                            buttonLabel: 'Plan Training',
                            detailTitle: 'Retailer Education Program',
                            detailContent: 'AI analyzed retailer performance metrics and identified 67 partners requiring product training. Training modules: product knowledge, sales techniques, customer service.'
                        }
                    ],
                    highTouch: [
                        {
                            title: 'Strategic retail partnership',
                            description: 'MegaStore Chain evaluating exclusive product line',
                            buttonLabel: 'Review Partnership',
                            detailTitle: 'Exclusive Partnership Opportunity',
                            detailContent: 'MegaStore Chain: 450 locations, $125M annual volume, premium market position. Evaluating exclusive rights for new product line. 3-year commitment: $45M minimum volume.'
                        },
                        {
                            title: 'At-risk retailer recovery',
                            description: 'Regional Retail Group showing declining performance',
                            buttonLabel: 'Review Account',
                            detailTitle: 'Retailer Performance Recovery',
                            detailContent: 'Regional Retail Group: 23 locations, $8.5M annual volume, declining performance. Issues: inventory management, staff turnover, competitive pressure. Recovery plan: operational support, marketing assistance.'
                        },
                        {
                            title: 'Category expansion meeting',
                            description: 'Top 15 retailers invited to new category launch',
                            buttonLabel: 'Plan Meeting',
                            detailTitle: 'Category Strategy Session',
                            detailContent: 'Category expansion meeting with top 15 retail partners representing 70% of channel volume. Agenda: new category introduction, market opportunity, partnership benefits. Combined annual volume: $85M.'
                        }
                    ],
                    siteVisits: [
                        {
                            title: 'Store format evaluation',
                            description: 'Premium Retail Concepts - New store format assessment',
                            buttonLabel: 'Review Assessment',
                            detailTitle: 'Store Format Analysis',
                            detailContent: 'Premium Retail Concepts: New store format pilot, 15,000 sq ft, premium positioning. Assessment scope: layout optimization, product mix, customer experience. Investment required: $1.8M buildout.'
                        },
                        {
                            title: 'Performance issue resolution',
                            description: 'Metro Retail Hub - Sales performance below expectations',
                            buttonLabel: 'Review Issue',
                            detailTitle: 'Performance Improvement Plan',
                            detailContent: 'Metro Retail Hub: 35% sales decline vs. target, customer traffic down 20%. Issues: product placement, staff training, competitive environment. Action plan: merchandising reset, staff development.'
                        },
                        {
                            title: 'Grand opening support',
                            description: 'SuperStore Plus - New flagship location launch',
                            buttonLabel: 'Review Launch',
                            detailTitle: 'Flagship Store Launch',
                            detailContent: 'SuperStore Plus flagship location: 25,000 sq ft, prime location, $3.2M investment. Grand opening support: product placement, staff training, promotional events. Projected annual volume: $12M.'
                        }
                    ]
                };
            }
            return this.getBaseContent();
        }
        
        // Consumer Goods vertical content
        if (vertical === 'Consumer Goods') {
            if (customerType === 'B2C') {
                return {
                    noTouch: [
                        {
                            title: 'Customer service automated',
                            description: 'AI handled 1,247 customer inquiries via chatbot',
                            buttonLabel: 'View Report',
                            detailTitle: 'Customer Service Automation',
                            detailContent: 'AI chatbot handled 1,247 customer inquiries with 94% satisfaction rate. Top inquiries: product information, order status, returns process. Only 6% escalated to human agents.'
                        },
                        {
                            title: 'Loyalty program optimized',
                            description: 'AI personalized offers for 15,680 members',
                            buttonLabel: 'View Offers',
                            detailTitle: 'Personalized Loyalty Program',
                            detailContent: 'AI analyzed customer behavior and created personalized offers for loyalty members. 15,680 custom offers generated, 28% redemption rate, $340K incremental revenue.'
                        },
                        {
                            title: 'Inventory restocking completed',
                            description: 'AI optimized stock levels for 89 top-selling items',
                            buttonLabel: 'View Inventory',
                            detailTitle: 'Intelligent Inventory Management',
                            detailContent: 'AI predicted demand patterns and optimized inventory levels. Reduced stockouts by 45% while decreasing carrying costs by 18%. 89 top-selling items now at optimal levels.'
                        }
                    ],
                    lowTouch: [
                        {
                            title: 'Approve marketing campaign',
                            description: 'AI designed targeted campaign for holiday season',
                            buttonLabel: 'Review Campaign',
                            detailTitle: 'Holiday Marketing Campaign',
                            detailContent: 'AI analyzed customer segments and designed targeted holiday campaign. Multi-channel approach: email, social media, in-store displays. Projected 22% increase in holiday sales.'
                        },
                        {
                            title: 'Review product feedback',
                            description: 'AI analyzed 2,340 customer reviews for insights',
                            buttonLabel: 'View Analysis',
                            detailTitle: 'Customer Feedback Analysis',
                            detailContent: 'AI processed customer reviews and identified key themes. Positive feedback: product quality, customer service. Improvement opportunities: packaging, delivery speed. Actionable insights for product development.'
                        },
                        {
                            title: 'Schedule influencer outreach',
                            description: 'AI identified 25 influencers for product collaboration',
                            buttonLabel: 'Review Influencers',
                            detailTitle: 'Influencer Marketing Strategy',
                            detailContent: 'AI analyzed influencer engagement rates and audience alignment. 25 influencers identified for product collaboration. Combined reach: 2.3M followers. Estimated campaign ROI: 4.2x.'
                        }
                    ],
                    highTouch: [
                        {
                            title: 'VIP customer engagement',
                            description: 'Premium customer requesting exclusive access',
                            buttonLabel: 'Review Request',
                            detailTitle: 'VIP Customer Experience',
                            detailContent: 'Premium customer (lifetime value: $15K) requesting exclusive access to limited edition products. Opportunity: personalized shopping experience, early access program, loyalty enhancement.'
                        },
                        {
                            title: 'Product complaint resolution',
                            description: 'Customer experiencing quality issues with recent purchase',
                            buttonLabel: 'Review Complaint',
                            detailTitle: 'Quality Issue Resolution',
                            detailContent: 'Customer complaint: product quality issue affecting satisfaction. Response plan: immediate replacement, quality investigation, follow-up satisfaction survey. Retention goal: maintain customer relationship.'
                        },
                        {
                            title: 'Brand ambassador program',
                            description: 'Top 50 customers invited to exclusive brand program',
                            buttonLabel: 'Review Program',
                            detailTitle: 'Brand Ambassador Initiative',
                            detailContent: 'Brand ambassador program for top 50 customers based on engagement and advocacy. Benefits: exclusive products, early access, feedback opportunities. Goal: increase brand loyalty and word-of-mouth marketing.'
                        }
                    ],
                    siteVisits: [
                        {
                            title: 'Home consultation',
                            description: 'Premium customer requesting in-home product consultation',
                            buttonLabel: 'Schedule Visit',
                            detailTitle: 'Personalized Home Consultation',
                            detailContent: 'Premium customer (annual spend: $8K) requesting in-home consultation for home organization products. Service: space assessment, product recommendations, installation guidance. Opportunity: upsell premium services.'
                        },
                        {
                            title: 'Product demo event',
                            description: 'Community center event - Product demonstration and sampling',
                            buttonLabel: 'Review Event',
                            detailTitle: 'Community Engagement Event',
                            detailContent: 'Community center product demonstration event: 150 attendees expected, product sampling, interactive demos. Goal: brand awareness, lead generation, community relationship building. Budget: $2,500.'
                        },
                        {
                            title: 'Installation support',
                            description: 'Customer needs help with complex product installation',
                            buttonLabel: 'Schedule Service',
                            detailTitle: 'Installation Support Service',
                            detailContent: 'Customer purchased complex product requiring installation support. Service: on-site installation, product training, warranty registration. Customer satisfaction goal: exceed expectations, generate positive reviews.'
                        }
                    ]
                };
            }
            return this.getBaseContent();
        }
        
        // Return base content for other verticals
        return this.getBaseContent();
    }

    getBaseContent() {
        return {
            noTouch: [
                {
                    title: 'Automated outreach completed',
                    description: 'AI completed targeted outreach campaign',
                    buttonLabel: 'View Report',
                    detailTitle: 'Automated Campaign Results',
                    detailContent: 'AI identified prospects and completed automated outreach campaign with personalized messaging.'
                },
                {
                    title: 'Price alerts sent',
                    description: 'AI notified customers about pricing changes',
                    buttonLabel: 'View Alerts',
                    detailTitle: 'Price Alert Campaign',
                    detailContent: 'AI monitored market conditions and sent proactive price alerts to affected customers.'
                },
                {
                    title: 'Calendar integration handled',
                    description: 'AI managed scheduling conflicts automatically',
                    buttonLabel: 'View Calendar',
                    detailTitle: 'Calendar Management',
                    detailContent: 'AI integrated with calendar systems to manage scheduling and resolve conflicts.'
                }
            ],
            lowTouch: [
                {
                    title: 'Approve campaign',
                    description: 'AI prepared targeted campaign for approval',
                    buttonLabel: 'Review Campaign',
                    detailTitle: 'Campaign Details',
                    detailContent: 'AI analyzed customer segments and prepared targeted campaign with personalized messaging.'
                },
                {
                    title: 'Review applications',
                    description: 'AI pre-screened applications for your review',
                    buttonLabel: 'Review Applications',
                    detailTitle: 'Application Analysis',
                    detailContent: 'AI evaluated applications against qualification criteria and provided recommendations.'
                },
                {
                    title: 'Schedule training',
                    description: 'AI identified candidates for training sessions',
                    buttonLabel: 'Schedule Training',
                    detailTitle: 'Training Opportunities',
                    detailContent: 'AI analyzed performance metrics and identified training opportunities for maximum impact.'
                }
            ],
            highTouch: [
                {
                    title: 'Major opportunity',
                    description: 'High-value prospect requires personal attention',
                    buttonLabel: 'Review Opportunity',
                    detailTitle: 'Opportunity Analysis',
                    detailContent: 'AI identified high-value opportunity with detailed analysis and engagement strategy.'
                },
                {
                    title: 'At-risk account',
                    description: 'Key account showing concerning signals',
                    buttonLabel: 'Review Account',
                    detailTitle: 'Account Risk Assessment',
                    detailContent: 'AI detected risk factors and recommended intervention strategies for account retention.'
                },
                {
                    title: 'Executive engagement',
                    description: 'C-level meeting opportunity identified',
                    buttonLabel: 'Schedule Meeting',
                    detailTitle: 'Executive Engagement',
                    detailContent: 'AI identified opportunity for executive-level engagement to advance strategic relationship.'
                }
            ],
            siteVisits: [
                {
                    title: 'Site assessment',
                    description: 'On-site evaluation required for major project',
                    buttonLabel: 'Review Details',
                    detailTitle: 'Site Assessment',
                    detailContent: 'AI identified need for on-site evaluation to support major project requirements.'
                },
                {
                    title: 'Issue resolution - URGENT',
                    description: 'Critical issue requires immediate on-site attention',
                    buttonLabel: 'Review Issue',
                    detailTitle: 'Critical Issue Alert',
                    detailContent: 'AI detected critical issue requiring immediate on-site response and resolution.'
                },
                {
                    title: 'Project consultation',
                    description: 'Customer needs consultation for new project',
                    buttonLabel: 'Review Project',
                    detailTitle: 'Project Consultation',
                    detailContent: 'AI identified opportunity for project consultation to support customer expansion.'
                }
            ]
        };
    }

    // UI event handlers
    handleItemClick(event) {
        // Get data attributes from the clicked info icon
        const section = event.currentTarget.dataset.section;
        const index = parseInt(event.currentTarget.dataset.index);
        
        if (section && index >= 0) {
            this.contentData[section][index].expanded = !this.contentData[section][index].expanded;
            
            // Trigger HTML content rendering after state change
            // Use setTimeout to ensure the DOM is updated before rendering HTML
            setTimeout(() => {
                this.renderHtmlContent();
            }, 0);
        }
    }

    handleButtonClick(event) {
        // Try multiple ways to get the data-link attribute
        let buttonLink = event.target.dataset.link || 
                        event.currentTarget.dataset.link ||
                        event.target.getAttribute('data-link') ||
                        event.currentTarget.getAttribute('data-link');
        
        // Find the info icon sibling to get section and index data
        const buttonElement = event.currentTarget;
        const contentItem = buttonElement.closest('.content-item');
        const infoIcon = contentItem.querySelector('.item-info-icon');
        
        if (infoIcon) {
            const sectionName = infoIcon.dataset.section;
            const itemIndex = parseInt(infoIcon.dataset.index);
            
            console.log('Hiding item:', sectionName, itemIndex);
            
            // Hide the item using the data attributes
            if (sectionName && itemIndex >= 0 && this.contentData[sectionName][itemIndex]) {
                this.contentData[sectionName][itemIndex].hidden = true;
                this.saveHiddenState();
                console.log('Item hidden successfully');
            }
        }
        
        // Navigate if there's a link
        if (buttonLink) {
            this.navigateToUrl(buttonLink);
        }
    }

    navigateToUrl(url) {
        if (!url) return;
        
        console.log('Navigate to:', url);
        
        // Handle different URL types
        if (url.startsWith('http://') || url.startsWith('https://')) {
            // External URL - open in new tab
            window.open(url, '_blank');
        } else {
            // For all Salesforce URLs, navigate in same tab
            // This handles Lightning URLs, external ID URLs, and relative URLs
            const baseUrl = window.location.origin;
            const fullUrl = url.startsWith('/') ? baseUrl + url : url;
            window.location.href = fullUrl;
        }
    }

    handleInfoToggle() {
        this.showInfoBox = !this.showInfoBox;
    }
    
    // Settings modal handlers
    handleSettingsClick() {
        this.showSettingsModal = true;
    }
    
    handleSettingsClose() {
        this.showSettingsModal = false;
    }
    
    handleModalOverlayClick(event) {
        // Close modal when clicking on overlay
        if (event.target.classList.contains('settings-modal-overlay')) {
            this.showSettingsModal = false;
        }
    }
    
    handleModalClick(event) {
        // Prevent modal from closing when clicking inside the modal
        event.stopPropagation();
    }
    
    handleCustomerContextChange(event) {
        this.customerContext = event.target.value;
    }
    
    handleComponentContextChange(event) {
        this.componentContext = event.target.value;
    }
    
    async handleGenerateContent() {
        if (!this.customerContext.trim()) {
            // Show error message if no customer context provided
            this.showToast('Error', 'Please provide customer and demo context for AI content generation', 'error');
            return;
        }
        
        // Start generation process with progress tracking
        this.isGenerating = true;
        this.generationProgress = 0;
        this.generationStatus = 'Analyzing company context...';
        
        try {
            // Simulate progress updates for better UX
            this.updateProgress(20, 'Understanding industry and business model...');
            
            // Generate content using the AI service with both contexts
            const generatedContent = await this.generateAIContent(this.customerContext, this.componentContext);
            
            this.updateProgress(80, 'Finalizing personalized content...');
            
            // Update the component with generated content
            this.updateComponentWithAIContent(generatedContent);
            
            this.updateProgress(100, 'Complete!');
            
            // Close the modal
            this.showSettingsModal = false;
            
            // Show success message
            this.showToast('Success', 'AI content generated and tailored to your customer context!', 'success');
            
        } catch (error) {
            console.error('Error generating AI content:', error);
            this.showToast('Error', 'Failed to generate AI content. Please try again.', 'error');
        } finally {
            // Reset generation state after a brief delay
            setTimeout(() => {
                this.isGenerating = false;
                this.generationProgress = 0;
                this.generationStatus = '';
            }, 1000);
        }
    }

    // Handle background generation option
    async handleGenerateContentInBackground() {
        if (!this.customerContext.trim()) {
            this.showToast('Error', 'Please provide customer context for AI content generation', 'error');
            return;
        }

        // Start background processing
        this.isBackgroundProcessing = true;
        this.showSettingsModal = false;
        
        // Show toast that content is being generated in background
        this.showToast('Info', 'AI is tailoring content to your customer in the background. You can continue working - we\'ll notify you when ready!', 'info');
        
        try {
            // Generate content in background
            const generatedContent = await this.generateAIContent(this.customerContext, this.componentContext);
            
            // Update the component with generated content
            this.updateComponentWithAIContent(generatedContent);
            
            // Notify user that background processing is complete
            this.showToast('Success', 'AI content generation complete! Your component has been updated with personalized content.', 'success');
            
        } catch (error) {
            console.error('Error generating AI content in background:', error);
            this.showToast('Error', 'Background AI content generation failed. Please try again manually.', 'error');
        } finally {
            this.isBackgroundProcessing = false;
        }
    }

    // Helper method to update progress
    updateProgress(progress, status) {
        this.generationProgress = progress;
        this.generationStatus = status;
        // Small delay to make progress visible
        return new Promise(resolve => setTimeout(resolve, 500));
    }
    
    async generateAIContent(customerContext, componentContext) {
        try {
            console.log('🤖 Calling real AI service with context:', customerContext);
            
            // Call Apex method to generate AI content using Hugging Face API
            const aiResponse = await generateAIContent({ 
                customerContext: customerContext,
                componentContext: componentContext 
            });
            
            console.log('✅ AI service response received:', aiResponse);
            
            // Parse the JSON response
            const contentData = JSON.parse(aiResponse);
            
            console.log('📊 Parsed AI content:', contentData);
            return contentData;
            
        } catch (error) {
            console.error('❌ Error calling Apex AI service:', error);
            
            // Fall back to mock data if API fails
            console.log('🔄 Falling back to mock content generation');
            const mockContent = this.generateMockAIContent(customerContext);
            return mockContent;
        }
    }
    
    generateMockAIContent(context) {
        // Enhanced mock AI content generation with dynamic context integration
        const contextLower = context.toLowerCase();
        
        console.log('🎭 Mock AI generating content for context:', context);
        
        let content = {
            noTouch: [],
            lowTouch: [],
            highTouch: [],
            siteVisits: []
        };
        
        // Extract key terms from context for personalization
        const contextWords = context.split(' ').filter(word => word.length > 3);
        const companyTerms = contextWords.filter(word => 
            word.toLowerCase().includes('company') || 
            word.toLowerCase().includes('corp') || 
            word.toLowerCase().includes('inc') ||
            word.toLowerCase().includes('ltd')
        );
        
        // Generate content based on context keywords
        if (contextLower.includes('manufacturing') || contextLower.includes('factory') || contextLower.includes('production')) {
            content = this.getManufacturingContent();
            console.log('🏭 Using manufacturing content template');
        } else if (contextLower.includes('retail') || contextLower.includes('store') || contextLower.includes('customer')) {
            content = this.getRetailContent();
            console.log('🏪 Using retail content template');
        } else if (contextLower.includes('healthcare') || contextLower.includes('hospital') || contextLower.includes('medical')) {
            content = this.getHealthcareContent();
            console.log('🏥 Using healthcare content template');
        } else if (contextLower.includes('technology') || contextLower.includes('software') || contextLower.includes('IT') || contextLower.includes('aws') || contextLower.includes('cloud')) {
            content = this.getTechnologyContent();
            console.log('💻 Using technology content template');
        } else {
            // Default general business content
            content = this.getGeneralBusinessContent();
            console.log('📊 Using general business content template');
        }
        
        // Add dynamic context-specific elements
        this.personalizeContent(content, context, contextLower);
        
        // Ensure all items have proper UI properties
        Object.keys(content).forEach(section => {
            content[section].forEach(item => {
                item.showButton = true;
                item.expanded = false;
                item.hidden = false;
            });
        });
        
        console.log('✨ Mock content generated with personalization');
        return content;
    }
    
    // Add personalization to mock content based on context
    personalizeContent(content, originalContext, contextLower) {
        // Look for specific company names or products mentioned
        const awsTerms = ['aws', 'amazon', 's3', 'ec2', 'lambda', 'cloud'];
        const hasAwsContext = awsTerms.some(term => contextLower.includes(term));
        
        if (hasAwsContext) {
            // Customize content for AWS context
            content.noTouch.forEach(item => {
                if (item.title.includes('Cloud') || item.title.includes('System')) {
                    item.description = item.description.replace('cloud resources', 'AWS infrastructure');
                    item.detailContent = item.detailContent.replace('cloud', 'AWS services like S3 and EC2');
                }
            });
            
            content.lowTouch.forEach(item => {
                if (item.title.includes('Review') || item.title.includes('Approve')) {
                    item.description = item.description + ' (includes AWS service optimization)';
                }
            });
            
            content.highTouch.forEach(item => {
                if (item.title.includes('Strategy') || item.title.includes('Planning')) {
                    item.description = item.description + ' focusing on AWS migration strategy';
                }
            });
        }
        
        // Add timestamp for uniqueness
        const timestamp = new Date().toLocaleTimeString();
        content.noTouch.forEach((item, index) => {
            if (index === 0) {
                item.description = item.description + ` (Generated at ${timestamp})`;
            }
        });
        
        // Add context-specific terms to descriptions
        const contextKeywords = originalContext.split(' ').filter(word => 
            word.length > 4 && 
            !['this', 'that', 'with', 'have', 'been', 'will', 'from', 'they', 'their'].includes(word.toLowerCase())
        );
        
        if (contextKeywords.length > 0) {
            const randomKeyword = contextKeywords[Math.floor(Math.random() * contextKeywords.length)];
            content.highTouch.forEach((item, index) => {
                if (index === 0) {
                    item.description = item.description + ` related to ${randomKeyword}`;
                }
            });
        }
    }
    
    getManufacturingContent() {
        return {
            noTouch: [
                {
                    title: 'Automated Quality Control Analysis',
                    description: 'AI analyzed 15 production lines and identified 3 quality improvement opportunities',
                    icon: 'utility:success',
                    buttonLabel: 'View Report',
                    buttonLink: '#',
                    detailTitle: 'Quality Control Insights',
                    detailContent: '<p>AI has detected patterns in quality control data suggesting optimization opportunities in lines 7, 12, and 15.</p>'
                },
                {
                    title: 'Predictive Maintenance Alerts',
                    description: 'Maintenance scheduled for 5 machines based on predictive analytics',
                    icon: 'utility:warning',
                    buttonLabel: 'View Schedule',
                    buttonLink: '#',
                    detailTitle: 'Maintenance Predictions',
                    detailContent: '<p>Based on sensor data and historical patterns, preventive maintenance has been scheduled for critical equipment.</p>'
                },
                {
                    title: 'Supplier RFQ Automation',
                    description: 'AI sent RFQ requests to 23 suppliers for new component requirements',
                    icon: 'utility:email',
                    buttonLabel: 'View Responses',
                    buttonLink: '#',
                    detailTitle: 'RFQ Automation',
                    detailContent: '<p>AI identified qualified suppliers and automatically sent RFQ requests with technical specifications. 15 responses received.</p>'
                }
            ],
            lowTouch: [
                {
                    title: 'Supplier Performance Review',
                    description: 'Review performance metrics for key suppliers',
                    icon: 'utility:chart',
                    buttonLabel: 'Review Metrics',
                    buttonLink: '#',
                    detailTitle: 'Supplier Analysis',
                    detailContent: '<p>Quarterly supplier performance review identifies top performers and areas for improvement.</p>'
                },
                {
                    title: 'Production Schedule Optimization',
                    description: 'Approve AI-recommended production schedule adjustments',
                    icon: 'utility:approval',
                    buttonLabel: 'Review Schedule',
                    buttonLink: '#',
                    detailTitle: 'Schedule Optimization',
                    detailContent: '<p>AI has identified opportunities to optimize production schedules for improved efficiency and reduced lead times.</p>'
                },
                {
                    title: 'Quality Audit Preparation',
                    description: 'AI prepared documentation for upcoming ISO audit',
                    icon: 'utility:document',
                    buttonLabel: 'Review Docs',
                    buttonLink: '#',
                    detailTitle: 'Audit Preparation',
                    detailContent: '<p>AI compiled all necessary documentation and identified potential compliance gaps for the upcoming quality audit.</p>'
                }
            ],
            highTouch: [
                {
                    title: 'Strategic Client Meeting',
                    description: 'Prepare for meeting with major manufacturing client',
                    icon: 'utility:people',
                    buttonLabel: 'View Brief',
                    buttonLink: '#',
                    detailTitle: 'Client Meeting Preparation',
                    detailContent: '<p>Comprehensive brief for upcoming strategic discussion with key manufacturing partner.</p>'
                },
                {
                    title: 'New Product Launch Planning',
                    description: 'Strategic planning session for Q2 product launch',
                    icon: 'utility:strategy',
                    buttonLabel: 'View Strategy',
                    buttonLink: '#',
                    detailTitle: 'Launch Strategy',
                    detailContent: '<p>Critical strategic planning required for successful product launch including market positioning and resource allocation.</p>'
                },
                {
                    title: 'At-Risk Contract Negotiation',
                    description: 'High-value contract at risk - requires immediate attention',
                    icon: 'utility:warning',
                    buttonLabel: 'Review Contract',
                    buttonLink: '#',
                    detailTitle: 'Contract Risk',
                    detailContent: '<p>$2.3M contract showing risk signals. Immediate intervention required to maintain relationship and secure renewal.</p>'
                }
            ],
            siteVisits: [
                {
                    title: 'Production Facility Tour',
                    description: 'Scheduled visit to review new production line installation',
                    icon: 'utility:location',
                    buttonLabel: 'View Details',
                    buttonLink: '#',
                    detailTitle: 'Site Visit Details',
                    detailContent: '<p>Comprehensive tour of new production facility including quality control stations and automation systems.</p>'
                },
                {
                    title: 'Customer Plant Assessment',
                    description: 'On-site evaluation of customer manufacturing processes',
                    icon: 'utility:location',
                    buttonLabel: 'Schedule Visit',
                    buttonLink: '#',
                    detailTitle: 'Plant Assessment',
                    detailContent: '<p>Customer requested on-site assessment of their manufacturing processes for potential efficiency improvements.</p>'
                }
            ]
        };
    }
    
    getRetailContent() {
        return {
            noTouch: [
                {
                    title: 'Customer Behavior Analysis',
                    description: 'AI analyzed shopping patterns and identified 5 optimization opportunities',
                    icon: 'utility:analytics',
                    buttonLabel: 'View Insights',
                    buttonLink: '#',
                    detailTitle: 'Customer Analytics',
                    detailContent: '<p>Deep analysis of customer shopping patterns reveals opportunities for improved product placement and promotions.</p>'
                },
                {
                    title: 'Inventory Optimization',
                    description: 'Automated reordering for 25 SKUs based on demand forecasting',
                    icon: 'utility:truck',
                    buttonLabel: 'View Orders',
                    buttonLink: '#',
                    detailTitle: 'Inventory Management',
                    detailContent: '<p>AI-driven demand forecasting has optimized inventory levels and automated reordering for high-velocity items.</p>'
                },
                {
                    title: 'Loyalty Program Automation',
                    description: 'AI personalized offers for 12,450 loyalty members',
                    icon: 'utility:gift',
                    buttonLabel: 'View Offers',
                    buttonLink: '#',
                    detailTitle: 'Personalized Offers',
                    detailContent: '<p>AI analyzed purchase history and preferences to create personalized offers for loyalty members, increasing redemption rates by 34%.</p>'
                }
            ],
            lowTouch: [
                {
                    title: 'Store Performance Review',
                    description: 'Monthly performance analysis for top 10 stores',
                    icon: 'utility:chart',
                    buttonLabel: 'View Report',
                    buttonLink: '#',
                    detailTitle: 'Store Analytics',
                    detailContent: '<p>Comprehensive performance review highlighting top-performing stores and improvement opportunities.</p>'
                },
                {
                    title: 'Marketing Campaign Approval',
                    description: 'AI designed targeted campaign for holiday season',
                    icon: 'utility:approval',
                    buttonLabel: 'Review Campaign',
                    buttonLink: '#',
                    detailTitle: 'Holiday Campaign',
                    detailContent: '<p>AI analyzed customer segments and created targeted holiday campaign with personalized messaging and optimal timing.</p>'
                },
                {
                    title: 'Vendor Negotiation Prep',
                    description: 'AI prepared negotiation strategy for 8 key vendors',
                    icon: 'utility:groups',
                    buttonLabel: 'View Strategy',
                    buttonLink: '#',
                    detailTitle: 'Vendor Strategy',
                    detailContent: '<p>AI analyzed vendor performance and market conditions to prepare optimal negotiation strategies for contract renewals.</p>'
                }
            ],
            highTouch: [
                {
                    title: 'Regional Manager Meeting',
                    description: 'Strategic planning session for Q4 retail initiatives',
                    icon: 'utility:strategy',
                    buttonLabel: 'View Agenda',
                    buttonLink: '#',
                    detailTitle: 'Strategic Planning',
                    detailContent: '<p>Q4 strategic planning session focusing on seasonal promotions and expansion opportunities.</p>'
                },
                {
                    title: 'VIP Customer Escalation',
                    description: 'High-value customer requires immediate attention',
                    icon: 'utility:warning',
                    buttonLabel: 'Review Case',
                    buttonLink: '#',
                    detailTitle: 'VIP Customer',
                    detailContent: '<p>Top-tier customer (lifetime value $45K) experiencing service issues. Immediate intervention required to maintain relationship.</p>'
                },
                {
                    title: 'New Store Launch Planning',
                    description: 'Strategic planning for flagship store opening',
                    icon: 'utility:home',
                    buttonLabel: 'View Plans',
                    buttonLink: '#',
                    detailTitle: 'Store Launch',
                    detailContent: '<p>Critical planning required for new flagship store opening including staffing, inventory, and marketing strategy.</p>'
                }
            ],
            siteVisits: [
                {
                    title: 'Flagship Store Visit',
                    description: 'Tour of new flagship location for merchandising review',
                    icon: 'utility:location',
                    buttonLabel: 'View Schedule',
                    buttonLink: '#',
                    detailTitle: 'Store Visit',
                    detailContent: '<p>Comprehensive review of flagship store layout, merchandising, and customer experience optimization.</p>'
                },
                {
                    title: 'Underperforming Store Assessment',
                    description: 'On-site evaluation of store with declining performance',
                    icon: 'utility:location',
                    buttonLabel: 'Schedule Visit',
                    buttonLink: '#',
                    detailTitle: 'Store Assessment',
                    detailContent: '<p>Store showing 15% decline in sales over past quarter. On-site assessment needed to identify improvement opportunities.</p>'
                }
            ]
        };
    }
    
    getHealthcareContent() {
        return {
            noTouch: [
                {
                    title: 'Patient Flow Optimization',
                    description: 'AI optimized scheduling reducing wait times by 25%',
                    icon: 'utility:success',
                    buttonLabel: 'View Results',
                    buttonLink: '#',
                    detailTitle: 'Flow Optimization',
                    detailContent: '<p>AI-driven scheduling optimization has significantly reduced patient wait times and improved satisfaction scores.</p>'
                },
                {
                    title: 'Medical Supply Automation',
                    description: 'AI automated reordering for 150+ medical supplies',
                    icon: 'utility:truck',
                    buttonLabel: 'View Inventory',
                    buttonLink: '#',
                    detailTitle: 'Supply Management',
                    detailContent: '<p>AI monitors usage patterns and automatically reorders medical supplies, reducing stockouts by 40% and optimizing costs.</p>'
                },
                {
                    title: 'Clinical Alert Processing',
                    description: 'AI processed 2,340 clinical alerts and prioritized urgent cases',
                    icon: 'utility:warning',
                    buttonLabel: 'View Alerts',
                    buttonLink: '#',
                    detailTitle: 'Alert Management',
                    detailContent: '<p>AI analyzed clinical alerts and automatically prioritized urgent cases, reducing response time by 35%.</p>'
                }
            ],
            lowTouch: [
                {
                    title: 'Equipment Utilization Review',
                    description: 'Monthly review of medical equipment usage patterns',
                    icon: 'utility:chart',
                    buttonLabel: 'View Report',
                    buttonLink: '#',
                    detailTitle: 'Equipment Analytics',
                    detailContent: '<p>Analysis of medical equipment utilization reveals opportunities for improved scheduling and resource allocation.</p>'
                },
                {
                    title: 'Staff Scheduling Optimization',
                    description: 'AI-recommended staffing adjustments for optimal coverage',
                    icon: 'utility:groups',
                    buttonLabel: 'Review Schedule',
                    buttonLink: '#',
                    detailTitle: 'Staffing Strategy',
                    detailContent: '<p>AI analyzed patient flow patterns and recommended staffing adjustments to improve coverage and reduce overtime costs.</p>'
                },
                {
                    title: 'Vendor Performance Review',
                    description: 'Quarterly assessment of medical equipment vendors',
                    icon: 'utility:approval',
                    buttonLabel: 'View Assessment',
                    buttonLink: '#',
                    detailTitle: 'Vendor Analysis',
                    detailContent: '<p>Comprehensive review of vendor performance including delivery times, quality metrics, and cost effectiveness.</p>'
                }
            ],
            highTouch: [
                {
                    title: 'Chief Medical Officer Meeting',
                    description: 'Strategic discussion on healthcare technology initiatives',
                    icon: 'utility:people',
                    buttonLabel: 'View Brief',
                    buttonLink: '#',
                    detailTitle: 'Strategic Healthcare Meeting',
                    detailContent: '<p>High-level discussion on technology initiatives to improve patient outcomes and operational efficiency.</p>'
                },
                {
                    title: 'Patient Safety Initiative',
                    description: 'Critical safety initiative requires immediate attention',
                    icon: 'utility:warning',
                    buttonLabel: 'Review Initiative',
                    buttonLink: '#',
                    detailTitle: 'Safety Priority',
                    detailContent: '<p>Patient safety initiative involving new protocols and staff training. Immediate attention required for implementation.</p>'
                },
                {
                    title: 'Department Expansion Planning',
                    description: 'Strategic planning for new cardiology wing',
                    icon: 'utility:home',
                    buttonLabel: 'View Plans',
                    buttonLink: '#',
                    detailTitle: 'Expansion Strategy',
                    detailContent: '<p>Critical planning required for new cardiology wing including equipment procurement and staff recruitment.</p>'
                }
            ],
            siteVisits: [
                {
                    title: 'Hospital Technology Tour',
                    description: 'Tour of new medical technology installations',
                    icon: 'utility:location',
                    buttonLabel: 'View Details',
                    buttonLink: '#',
                    detailTitle: 'Technology Tour',
                    detailContent: '<p>Comprehensive tour of new medical technology installations including AI diagnostic tools and patient monitoring systems.</p>'
                },
                {
                    title: 'Satellite Clinic Assessment',
                    description: 'On-site evaluation of satellite clinic operations',
                    icon: 'utility:location',
                    buttonLabel: 'Schedule Visit',
                    buttonLink: '#',
                    detailTitle: 'Clinic Assessment',
                    detailContent: '<p>Satellite clinic requesting operational assessment to improve efficiency and patient satisfaction scores.</p>'
                }
            ]
        };
    }
    
    getTechnologyContent() {
        return {
            noTouch: [
                {
                    title: 'System Performance Monitoring',
                    description: 'AI monitored 50+ systems with 99.9% uptime achieved',
                    icon: 'utility:success',
                    buttonLabel: 'View Dashboard',
                    buttonLink: '#',
                    detailTitle: 'System Monitoring',
                    detailContent: '<p>Automated system monitoring with AI-driven anomaly detection ensures optimal performance and minimal downtime.</p>'
                },
                {
                    title: 'Security Threat Detection',
                    description: 'AI identified and blocked 1,240 security threats automatically',
                    icon: 'utility:shield',
                    buttonLabel: 'View Report',
                    buttonLink: '#',
                    detailTitle: 'Security Protection',
                    detailContent: '<p>AI-powered security system detected and neutralized potential threats, maintaining 100% security compliance.</p>'
                },
                {
                    title: 'Cloud Resource Optimization',
                    description: 'AI optimized cloud resources reducing costs by 23%',
                    icon: 'utility:cloud',
                    buttonLabel: 'View Savings',
                    buttonLink: '#',
                    detailTitle: 'Cost Optimization',
                    detailContent: '<p>AI analyzed usage patterns and automatically optimized cloud resources, achieving significant cost savings without performance impact.</p>'
                }
            ],
            lowTouch: [
                {
                    title: 'Software License Review',
                    description: 'Quarterly review of software licensing and usage',
                    icon: 'utility:apps',
                    buttonLabel: 'View Report',
                    buttonLink: '#',
                    detailTitle: 'License Management',
                    detailContent: '<p>Comprehensive review of software licensing reveals optimization opportunities and cost savings.</p>'
                },
                {
                    title: 'Infrastructure Capacity Planning',
                    description: 'AI-recommended capacity adjustments for peak loads',
                    icon: 'utility:chart',
                    buttonLabel: 'Review Plan',
                    buttonLink: '#',
                    detailTitle: 'Capacity Strategy',
                    detailContent: '<p>AI analyzed historical usage patterns and recommended capacity adjustments to handle projected growth efficiently.</p>'
                },
                {
                    title: 'Vendor Contract Negotiations',
                    description: 'Prepare for technology vendor contract renewals',
                    icon: 'utility:groups',
                    buttonLabel: 'Review Terms',
                    buttonLink: '#',
                    detailTitle: 'Contract Strategy',
                    detailContent: '<p>Strategic preparation for vendor contract negotiations including cost analysis and alternative vendor evaluation.</p>'
                }
            ],
            highTouch: [
                {
                    title: 'CTO Strategy Session',
                    description: 'Technology roadmap planning for next fiscal year',
                    icon: 'utility:strategy',
                    buttonLabel: 'View Roadmap',
                    buttonLink: '#',
                    detailTitle: 'Technology Strategy',
                    detailContent: '<p>Strategic planning session to define technology roadmap and digital transformation initiatives.</p>'
                },
                {
                    title: 'Critical System Migration',
                    description: 'High-priority system migration requires executive oversight',
                    icon: 'utility:warning',
                    buttonLabel: 'Review Plan',
                    buttonLink: '#',
                    detailTitle: 'Migration Strategy',
                    detailContent: '<p>Critical system migration project requiring executive attention for risk mitigation and timeline management.</p>'
                },
                {
                    title: 'Enterprise Architecture Review',
                    description: 'Strategic architecture assessment for digital transformation',
                    icon: 'utility:home',
                    buttonLabel: 'View Assessment',
                    buttonLink: '#',
                    detailTitle: 'Architecture Strategy',
                    detailContent: '<p>Comprehensive enterprise architecture review to support digital transformation and future scalability requirements.</p>'
                }
            ],
            siteVisits: [
                {
                    title: 'Data Center Tour',
                    description: 'Visit to new cloud infrastructure deployment',
                    icon: 'utility:location',
                    buttonLabel: 'View Details',
                    buttonLink: '#',
                    detailTitle: 'Infrastructure Tour',
                    detailContent: '<p>Tour of new cloud infrastructure including edge computing capabilities and security enhancements.</p>'
                },
                {
                    title: 'Client IT Assessment',
                    description: 'On-site evaluation of client technology infrastructure',
                    icon: 'utility:location',
                    buttonLabel: 'Schedule Visit',
                    buttonLink: '#',
                    detailTitle: 'IT Assessment',
                    detailContent: '<p>Client requested on-site assessment of their IT infrastructure to identify modernization opportunities.</p>'
                }
            ]
        };
    }
    
    getGeneralBusinessContent() {
        return {
            noTouch: [
                {
                    title: 'Business Intelligence Report',
                    description: 'AI generated insights from quarterly business data',
                    icon: 'utility:analytics',
                    buttonLabel: 'View Report',
                    buttonLink: '#',
                    detailTitle: 'Business Intelligence',
                    detailContent: '<p>AI-powered analysis of business metrics reveals key trends and opportunities for growth.</p>'
                },
                {
                    title: 'Customer Segmentation Analysis',
                    description: 'AI identified 5 new customer segments for targeted marketing',
                    icon: 'utility:groups',
                    buttonLabel: 'View Segments',
                    buttonLink: '#',
                    detailTitle: 'Customer Analytics',
                    detailContent: '<p>AI analyzed customer data and identified new market segments with high growth potential and specific needs.</p>'
                },
                {
                    title: 'Risk Assessment Automation',
                    description: 'AI completed quarterly risk assessment across all departments',
                    icon: 'utility:shield',
                    buttonLabel: 'View Assessment',
                    buttonLink: '#',
                    detailTitle: 'Risk Management',
                    detailContent: '<p>AI evaluated business risks and compliance requirements, identifying mitigation strategies for top risk factors.</p>'
                }
            ],
            lowTouch: [
                {
                    title: 'Performance Metrics Review',
                    description: 'Monthly KPI analysis and trend identification',
                    icon: 'utility:chart',
                    buttonLabel: 'View Metrics',
                    buttonLink: '#',
                    detailTitle: 'Performance Analysis',
                    detailContent: '<p>Comprehensive review of key performance indicators and business metrics for strategic decision-making.</p>'
                },
                {
                    title: 'Budget Variance Analysis',
                    description: 'AI-identified budget variances requiring manager approval',
                    icon: 'utility:approval',
                    buttonLabel: 'Review Variances',
                    buttonLink: '#',
                    detailTitle: 'Budget Management',
                    detailContent: '<p>AI detected significant budget variances and prepared analysis for management review and corrective action.</p>'
                },
                {
                    title: 'Competitive Analysis Update',
                    description: 'Quarterly competitive landscape analysis prepared',
                    icon: 'utility:chart',
                    buttonLabel: 'View Analysis',
                    buttonLink: '#',
                    detailTitle: 'Market Intelligence',
                    detailContent: '<p>Comprehensive competitive analysis highlighting market changes and strategic positioning opportunities.</p>'
                }
            ],
            highTouch: [
                {
                    title: 'Executive Strategy Meeting',
                    description: 'Strategic planning session with senior leadership',
                    icon: 'utility:people',
                    buttonLabel: 'View Agenda',
                    buttonLink: '#',
                    detailTitle: 'Strategic Planning',
                    detailContent: '<p>High-level strategic planning session focusing on growth opportunities and market expansion.</p>'
                },
                {
                    title: 'Merger & Acquisition Opportunity',
                    description: 'Strategic acquisition target requires immediate evaluation',
                    icon: 'utility:warning',
                    buttonLabel: 'Review Opportunity',
                    buttonLink: '#',
                    detailTitle: 'M&A Strategy',
                    detailContent: '<p>Time-sensitive acquisition opportunity requiring executive attention for due diligence and strategic evaluation.</p>'
                },
                {
                    title: 'Board Presentation Preparation',
                    description: 'Quarterly board meeting presentation requires executive review',
                    icon: 'utility:document',
                    buttonLabel: 'Review Presentation',
                    buttonLink: '#',
                    detailTitle: 'Board Relations',
                    detailContent: '<p>Critical board presentation covering financial performance, strategic initiatives, and growth projections.</p>'
                }
            ],
            siteVisits: [
                {
                    title: 'Corporate Office Visit',
                    description: 'Tour of new corporate headquarters and facilities',
                    icon: 'utility:location',
                    buttonLabel: 'View Schedule',
                    buttonLink: '#',
                    detailTitle: 'Office Tour',
                    detailContent: '<p>Comprehensive tour of new corporate facilities including collaboration spaces and innovation labs.</p>'
                },
                {
                    title: 'Client Executive Meeting',
                    description: 'On-site meeting with key client executive team',
                    icon: 'utility:location',
                    buttonLabel: 'Review Agenda',
                    buttonLink: '#',
                    detailTitle: 'Executive Meeting',
                    detailContent: '<p>Strategic meeting with client executive team to discuss partnership expansion and long-term collaboration.</p>'
                }
            ]
        };
    }
    
    updateComponentWithAIContent(content) {
        // Preserve the hidden state of existing items
        const existingHiddenState = {};
        Object.keys(this.contentData).forEach(section => {
            existingHiddenState[section] = this.contentData[section].map(item => item.hidden || false);
        });
        
        // Update the component's content with AI-generated data
        this.contentData = content;
        
        // Ensure all items have required properties for the UI
        Object.keys(this.contentData).forEach(section => {
            this.contentData[section].forEach((item, index) => {
                // Set default values for UI properties
                item.expanded = item.expanded || false;
                item.hidden = existingHiddenState[section] && existingHiddenState[section][index] || false;
                item.showButton = item.showButton !== false; // Default to true unless explicitly false
                
                // Ensure required properties exist
                if (!item.icon) item.icon = 'utility:success';
                if (!item.buttonLabel) item.buttonLabel = 'View Details';
                if (!item.buttonLink) item.buttonLink = '#';
            });
        });
        
        // Persist AI content as new component defaults
        this.persistAIContent(this.contentData);
        
        // Save the updated hidden state
        this.saveHiddenState();
        
        // Force re-render of HTML content
        this.renderHtmlContent();
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

    // Computed properties
    get processedButtonColor() {
        let color = this.buttonColor;
        if (color && !color.startsWith('#')) {
            color = '#' + color;
        }
        return color || '#0576D3';
    }

    get buttonStyle() {
        return `background-color: ${this.processedButtonColor} !important; border-color: ${this.processedButtonColor} !important; border-top-color: ${this.processedButtonColor} !important; border-right-color: ${this.processedButtonColor} !important; border-bottom-color: ${this.processedButtonColor} !important; border-left-color: ${this.processedButtonColor} !important;`;
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

    // Load persisted AI content from localStorage
    loadPersistedAIContent() {
        try {
            const storedContent = localStorage.getItem('aiSalesAssistant_persistedContent');
            if (storedContent) {
                const parsedContent = JSON.parse(storedContent);
                
                // Verify the content structure
                if (parsedContent && parsedContent.noTouch && parsedContent.lowTouch && parsedContent.highTouch) {
                    this.contentData = parsedContent;
                    this.hasAIContent = true;
                    
                    // Add persistence metadata
                    const persistenceInfo = localStorage.getItem('aiSalesAssistant_persistenceInfo');
                    if (persistenceInfo) {
                        const info = JSON.parse(persistenceInfo);
                        const daysAgo = Math.floor((Date.now() - new Date(info.timestamp).getTime()) / (1000 * 60 * 60 * 24));
                        console.log(`✅ Loaded persisted AI content from ${info.date} (${daysAgo} days ago)`);
                    }
                    
                    // Ensure all items have required UI properties
                    Object.keys(this.contentData).forEach(section => {
                        this.contentData[section].forEach(item => {
                            item.expanded = item.expanded || false;
                            item.hidden = item.hidden || false;
                            item.showButton = item.showButton !== false;
                            
                            // Ensure required properties exist
                            if (!item.icon) item.icon = 'utility:success';
                            if (!item.buttonLabel) item.buttonLabel = 'View Details';
                            if (!item.buttonLink) item.buttonLink = '#';
                        });
                    });
                    
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Error loading persisted AI content:', error);
            return false;
        }
    }

    // Enhanced persist AI content with metadata
    persistAIContent(content) {
        try {
            // Clean the content for storage (remove UI state)
            const cleanContent = {};
            Object.keys(content).forEach(section => {
                cleanContent[section] = content[section].map(item => ({
                    title: item.title,
                    description: item.description,
                    icon: item.icon,
                    buttonLabel: item.buttonLabel,
                    buttonLink: item.buttonLink,
                    detailTitle: item.detailTitle,
                    detailContent: item.detailContent,
                    showButton: item.showButton
                }));
            });
            
            // Store content
            localStorage.setItem('aiSalesAssistant_persistedContent', JSON.stringify(cleanContent));
            
            // Store persistence metadata
            const persistenceInfo = {
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString(),
                browser: navigator.userAgent.split(' ')[0],
                contentHash: this.generateContentHash(cleanContent)
            };
            localStorage.setItem('aiSalesAssistant_persistenceInfo', JSON.stringify(persistenceInfo));
            
            this.hasAIContent = true;
            console.log('✅ AI content persisted to localStorage with metadata');
            
            // Auto-generate export for backup
            this.generateConfigExport(cleanContent, persistenceInfo);
            
        } catch (error) {
            console.error('Error persisting AI content:', error);
        }
    }

    // Generate a simple hash for content comparison
    generateContentHash(content) {
        const contentString = JSON.stringify(content);
        let hash = 0;
        for (let i = 0; i < contentString.length; i++) {
            const char = contentString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    // Generate exportable configuration
    generateConfigExport(content, persistenceInfo) {
        const exportData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            orgId: 'demo-org', // Could be dynamic if needed
            content: content,
            metadata: persistenceInfo
        };
        
        // Store export data for easy retrieval
        localStorage.setItem('aiSalesAssistant_latestExport', JSON.stringify(exportData));
        console.log('📦 Configuration export generated and stored');
    }

    // Import configuration from export data
    importConfiguration(exportDataString) {
        try {
            const exportData = JSON.parse(exportDataString);
            
            if (!exportData.version || !exportData.content) {
                throw new Error('Invalid export format');
            }
            
            // Verify content structure
            if (!exportData.content.noTouch || !exportData.content.lowTouch || !exportData.content.highTouch) {
                throw new Error('Invalid content structure');
            }
            
            // Import the content
            this.contentData = exportData.content;
            this.persistAIContent(exportData.content);
            
            // Force UI refresh
            this.renderHtmlContent();
            this.saveHiddenState();
            
            this.showToast('Import Successful', 'Configuration imported successfully', 'success');
            console.log('✅ Configuration imported successfully');
            
        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Import Failed', 'Could not import configuration: ' + error.message, 'error');
        }
    }

    // Check persistence health and show warnings
    checkPersistenceHealth() {
        try {
            const persistenceInfo = localStorage.getItem('aiSalesAssistant_persistenceInfo');
            if (persistenceInfo && this.hasAIContent) {
                const info = JSON.parse(persistenceInfo);
                const daysSince = Math.floor((Date.now() - new Date(info.timestamp).getTime()) / (1000 * 60 * 60 * 24));
                
                if (daysSince > 30) {
                    console.warn(`⚠️ AI content is ${daysSince} days old. Consider exporting for backup.`);
                    return {
                        status: 'warning',
                        message: `Content is ${daysSince} days old`,
                        recommendation: 'Export for backup'
                    };
                } else if (daysSince > 7) {
                    console.log(`ℹ️ AI content is ${daysSince} days old.`);
                    return {
                        status: 'info',
                        message: `Content is ${daysSince} days old`,
                        recommendation: 'Still fresh'
                    };
                }
            }
            return { status: 'good', message: 'Content is fresh' };
        } catch (error) {
            return { status: 'error', message: 'Could not check persistence health' };
        }
    }

    // Export current configuration to clipboard
    async handleExportConfig() {
        try {
            const exportData = localStorage.getItem('aiSalesAssistant_latestExport');
            if (exportData) {
                await navigator.clipboard.writeText(exportData);
                this.showToast('Export Copied', 'Configuration copied to clipboard. Save this for backup!', 'success');
            } else {
                this.showToast('No Export Available', 'Generate AI content first to create an export', 'warning');
            }
        } catch (error) {
            console.error('Export failed:', error);
            this.showToast('Export Failed', 'Could not copy export to clipboard', 'error');
        }
    }

    // Import configuration from clipboard
    async handleImportConfig() {
        try {
            const clipboardText = await navigator.clipboard.readText();
            this.importConfiguration(clipboardText);
        } catch (error) {
            console.error('Import failed:', error);
            this.showToast('Import Failed', 'Could not read from clipboard or invalid format', 'error');
        }
    }

    // Reset to original design attributes
    handleResetToOriginal() {
        try {
            // Clear persisted AI content
            localStorage.removeItem('aiSalesAssistant_persistedContent');
            localStorage.removeItem('aiSalesAssistant_persistenceInfo');
            localStorage.removeItem('aiSalesAssistant_latestExport');
            
            // Reload from design attributes
            this.loadContentFromDesignAttributes();
            this.hasAIContent = false;
            
            // Clear hidden state and reset UI
            this.handleRefresh();
            
            console.log('✅ Reset to original design attributes');
        } catch (error) {
            console.error('Error resetting to original:', error);
        }
    }

    // Show copy to App Builder modal
    handleCopyToAppBuilder() {
        this.showCopyModal = true;
    }

    // Close copy modal
    handleCopyModalClose() {
        this.showCopyModal = false;
    }

    // Handle copy modal overlay click
    handleCopyModalOverlayClick(event) {
        if (event.target.classList.contains('copy-modal-overlay')) {
            this.handleCopyModalClose();
        }
    }

    // Handle copy modal content click (prevent close)
    handleCopyModalClick(event) {
        event.stopPropagation();
    }

    // Copy specific field to clipboard
    async handleCopyField(event) {
        const fieldValue = event.target.dataset.value;
        const fieldName = event.target.dataset.field;
        
        try {
            await navigator.clipboard.writeText(fieldValue);
            this.showToast('Copied!', `${fieldName} copied to clipboard`, 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            this.showToast('Copy Failed', 'Could not copy to clipboard', 'error');
        }
    }

    // Get mapping data for App Builder
    get appBuilderMapping() {
        if (!this.contentData || !this.hasAIContent) return null;

        const mapping = {
            noTouch: [],
            lowTouch: [],
            highTouch: [],
            siteVisits: []
        };

        // Map each section
        Object.keys(this.contentData).forEach(section => {
            this.contentData[section].forEach((item, index) => {
                const itemNum = index + 1;
                const sectionName = section === 'noTouch' ? 'No Touch' : 
                                  section === 'lowTouch' ? 'Low Touch' : 
                                  section === 'highTouch' ? 'High Touch' : 'Site Visits';
                
                mapping[section].push({
                    title: {
                        field: `${section}${itemNum}Title`,
                        label: `${sectionName} ${itemNum} Title`,
                        value: item.title || ''
                    },
                    description: {
                        field: `${section}${itemNum}Desc`,
                        label: `${sectionName} ${itemNum} Description`,
                        value: item.description || ''
                    },
                    icon: {
                        field: `${section}${itemNum}Icon`,
                        label: `${sectionName} ${itemNum} Icon`,
                        value: item.icon || ''
                    },
                    buttonLabel: {
                        field: `${section}${itemNum}ButtonLabel`,
                        label: `${sectionName} ${itemNum} Button Label`,
                        value: item.buttonLabel || ''
                    },
                    buttonLink: {
                        field: `${section}${itemNum}ButtonLink`,
                        label: `${sectionName} ${itemNum} Button Link`,
                        value: item.buttonLink || ''
                    },
                    detailTitle: {
                        field: `${section}${itemNum}DetailTitle`,
                        label: `${sectionName} ${itemNum} Detail Title`,
                        value: item.detailTitle || ''
                    },
                    detailContent: {
                        field: `${section}${itemNum}DetailContent`,
                        label: `${sectionName} ${itemNum} Detail Content`,
                        value: item.detailContent || ''
                    }
                });
            });
        });

        return mapping;
    }
} 