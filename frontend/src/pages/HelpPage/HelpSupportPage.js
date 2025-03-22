// src/pages/HelpPage/HelpSupportPage.js
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  TextField,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Tab,
  Tabs,
  IconButton,
  InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ChatIcon from '@mui/icons-material/Chat';
import BookIcon from '@mui/icons-material/Book';

// List of FAQs
const faqs = [
  {
    question: "How do I rent an EV bike?",
    answer: "To rent an EV bike, first create an account and verify your identity through DigiLocker. Then select your source and destination locations, choose an available bike, and make the payment. You'll receive an unlock code to begin your ride."
  },
  {
    question: "What documents are required for verification?",
    answer: "You need to provide a valid government ID (such as Aadhar card, Voter ID, or passport) and a valid driving license through DigiLocker for verification."
  },
  {
    question: "How does the payment system work?",
    answer: "You can pay for your rides using credit/debit cards, UPI, or digital wallets. After completing your ride, the final amount will be calculated based on the distance traveled and time taken."
  },
  {
    question: "What if I encounter an issue with the bike during my ride?",
    answer: "If you encounter any issues with the bike during your ride, you can use the 'Report Issue' button in the app to immediately notify our support team. For urgent situations, you can call our 24/7 helpline."
  },
  {
    question: "How do I end my ride?",
    answer: "To end your ride, navigate to the 'End Ride' option in the app, park the bike in a designated zone, and confirm the end ride. The app will capture an image of the bike to verify its condition."
  },
  {
    question: "What if I get a puncture or mechanical failure?",
    answer: "In case of a puncture or mechanical failure, please contact our support team immediately through the app or helpline. We'll arrange for assistance or a replacement bike depending on your location."
  },
  {
    question: "Are there any late return penalties?",
    answer: "Yes, there are penalties for returning the bike later than the scheduled time. The late fee is calculated based on the extra time taken and is automatically added to your bill."
  },
  {
    question: "Where can I park the EV bike?",
    answer: "You can park the EV bike in any of our designated parking zones, which are marked in the app map. Parking outside these zones may result in a penalty."
  }
];

// Help articles
const helpArticles = [
  {
    id: 1,
    title: "Getting Started with EV Bike Rental",
    category: "Getting Started",
    time: "3 min read"
  },
  {
    id: 2,
    title: "Understanding the Pricing Structure",
    category: "Payments",
    time: "2 min read"
  },
  {
    id: 3,
    title: "How to Report Issues During a Ride",
    category: "Troubleshooting",
    time: "4 min read"
  },
  {
    id: 4,
    title: "Finding Available Bikes Near You",
    category: "Usage",
    time: "2 min read"
  },
  {
    id: 5,
    title: "Extending Your Ride Duration",
    category: "Usage",
    time: "1 min read"
  },
  {
    id: 6,
    title: "Understanding Penalties and Charges",
    category: "Payments",
    time: "3 min read"
  }
];

const HelpSupportPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [issueCategory, setIssueCategory] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);
  const [filteredArticles, setFilteredArticles] = useState(helpArticles);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    // Filter FAQs based on search query
    const filtered = faqs.filter(
      faq => faq.question.toLowerCase().includes(query) || 
             faq.answer.toLowerCase().includes(query)
    );
    setFilteredFaqs(filtered);
    
    // Filter articles based on search query
    const filteredHelpArticles = helpArticles.filter(
      article => article.title.toLowerCase().includes(query) ||
                article.category.toLowerCase().includes(query)
    );
    setFilteredArticles(filteredHelpArticles);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleIssueCategoryChange = (event) => {
    setIssueCategory(event.target.value);
  };

  const handleSupportMessageChange = (event) => {
    setSupportMessage(event.target.value);
  };

  const handleSubmitIssue = () => {
    // Here you would handle the submission to your backend
    console.log('Submitting issue:', { category: issueCategory, message: supportMessage });
    
    // Reset form
    setIssueCategory('');
    setSupportMessage('');
    
    // Show success message or redirect
    alert('Your issue has been submitted successfully. Our support team will contact you soon.');
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Help & Support
      </Typography>
      
      {/* Search bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <TextField
          fullWidth
          placeholder="Search for help..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 4 }
          }}
        />
      </Paper>
      
      {/* Quick Support Options */}
      <Typography variant="h6" gutterBottom>
        Get Support
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <IconButton 
                sx={{ 
                  bgcolor: 'primary.light', 
                  mb: 2,
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                <PhoneIcon sx={{ color: 'primary.main' }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                Call Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                24/7 Helpline
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                +91 800-123-4567
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <IconButton 
                sx={{ 
                  bgcolor: 'success.light', 
                  mb: 2,
                  '&:hover': { bgcolor: 'success.main' }
                }}
              >
                <EmailIcon sx={{ color: 'success.main' }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                Email Support
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Response within 24 hours
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
                support@evbikerental.com
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            height: '100%', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <IconButton 
                sx={{ 
                  bgcolor: 'warning.light', 
                  mb: 2,
                  '&:hover': { bgcolor: 'warning.main' }
                }}
              >
                <ChatIcon sx={{ color: 'warning.main' }} />
              </IconButton>
              <Typography variant="h6" gutterBottom>
                Live Chat
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available 9 AM - 6 PM
              </Typography>
              <Button 
                variant="contained" 
                color="warning" 
                sx={{ mt: 2 }}
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* FAQs and Help Articles Tabs */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="help tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<HelpIcon />} iconPosition="start" label="Frequently Asked Questions" />
            <Tab icon={<BookIcon />} iconPosition="start" label="Help Articles" />
            <Tab icon={<ContactSupportIcon />} iconPosition="start" label="Contact Support" />
          </Tabs>
        </Box>
        
        {/* FAQs Tab */}
        {activeTab === 0 && (
          <Box sx={{ mt: 3 }}>
            {searchQuery && filteredFaqs.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                No FAQs found matching "{searchQuery}"
              </Typography>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Accordion 
                  key={index} 
                  elevation={0}
                  sx={{ 
                    mb: 1, 
                    '&:before': { display: 'none' },
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    borderRadius: '8px !important',
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                    sx={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Box>
        )}
        
        {/* Help Articles Tab */}
        {activeTab === 1 && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {searchQuery && filteredArticles.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No articles found matching "{searchQuery}"
                  </Typography>
                </Grid>
              ) : (
                filteredArticles.map((article) => (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        borderRadius: 2,
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="subtitle1" fontWeight={500}>
                            {article.title}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                          <Chip 
                            label={article.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                          <Typography variant="caption" color="text.secondary">
                            {article.time}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        )}
        
        {/* Contact Support Tab */}
        {activeTab === 2 && (
          <Box sx={{ mt: 3 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" gutterBottom>
                Submit a Support Ticket
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please fill out the form below and our support team will get back to you as soon as possible.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="issue-category-label">Issue Category</InputLabel>
                    <Select
                      labelId="issue-category-label"
                      value={issueCategory}
                      label="Issue Category"
                      onChange={handleIssueCategoryChange}
                    >
                      <MenuItem value="account">Account Issues</MenuItem>
                      <MenuItem value="billing">Billing & Payments</MenuItem>
                      <MenuItem value="bike">Bike Problems</MenuItem>
                      <MenuItem value="app">App Technical Issues</MenuItem>
                      <MenuItem value="feedback">Feedback & Suggestions</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Describe your issue"
                    multiline
                    rows={4}
                    value={supportMessage}
                    onChange={handleSupportMessageChange}
                    placeholder="Please provide as much detail as possible..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    variant="contained" 
                    endIcon={<SendIcon />}
                    onClick={handleSubmitIssue}
                    disabled={!issueCategory || !supportMessage}
                  >
                    Submit Ticket
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HelpSupportPage;
