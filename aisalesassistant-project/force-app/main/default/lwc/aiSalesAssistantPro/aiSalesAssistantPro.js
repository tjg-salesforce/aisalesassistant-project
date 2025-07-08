import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AiSalesAssistantPro extends NavigationMixin(LightningElement) {
    // Design attributes - Component Settings
    @api componentTitle = 'AI Sales Assistant Pro';
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

    // Lifecycle
    connectedCallback() {
        this.loadContentFromDesignAttributes();
        this.loadHiddenState();
        this.updateButtonColor();
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
} 