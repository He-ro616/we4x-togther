import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: January 23, 2026
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">Introduction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We4X Community Connect Hub ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application (collectively, the "Service").
                </p>
                <p>
                  Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. By accessing or using We4X, you acknowledge that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* 1. Information We Collect */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Information You Provide:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Account registration details (name, email, password)</li>
                    <li>Profile information (bio, location, avatar, social links)</li>
                    <li>Posts and comments you create</li>
                    <li>Event registrations and attendance</li>
                    <li>Communication with other users</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Information from Google OAuth:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Email address</li>
                    <li>Full name</li>
                    <li>Profile picture</li>
                    <li>Any other information you authorize</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Automatically Collected Information:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Browser type and version</li>
                    <li>IP address</li>
                    <li>Pages visited and time spent</li>
                    <li>Device information</li>
                    <li>Usage patterns and analytics</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 2. How We Use Your Information */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Create and maintain your account</li>
                  <li>Provide and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send marketing and promotional communications (with your consent)</li>
                  <li>Respond to your inquiries and customer support requests</li>
                  <li>Monitor and prevent fraud and security issues</li>
                  <li>Personalize your experience on the platform</li>
                  <li>Conduct analytics and understand user behavior</li>
                  <li>Comply with legal obligations</li>
                  <li>Enforce our Terms of Service and other agreements</li>
                </ul>
              </CardContent>
            </Card>

            {/* 3. How We Share Your Information */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">3. How We Share Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">We do NOT sell your data.</h3>
                </div>
                <p>We may share your information in the following circumstances:</p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">With Service Providers:</h4>
                  <p>We may share information with vendors who assist us in operating our Service, including Supabase for data hosting and Google for authentication.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Public Content:</h4>
                  <p>Any posts, comments, or profile information you make public will be visible to other users and may be indexed by search engines.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Legal Requirements:</h4>
                  <p>We may disclose your information if required by law or if we believe in good faith that disclosure is necessary to protect our rights or comply with legal processes.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Business Transfers:</h4>
                  <p>If we merge, sell, or transfer our business, your information may be part of that transaction.</p>
                </div>
              </CardContent>
            </Card>

            {/* 4. Data Security */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">4. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Encrypted data transmission (HTTPS)</li>
                  <li>Secure password storage with hashing</li>
                  <li>Row-Level Security (RLS) database policies</li>
                  <li>Regular security updates and patches</li>
                  <li>Access controls and authentication mechanisms</li>
                </ul>
                <p className="mt-4 text-sm">
                  However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security, and any transmission is at your own risk.
                </p>
              </CardContent>
            </Card>

            {/* 5. Your Privacy Rights */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">5. Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You have the following rights regarding your personal information:</p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Right to Access:</h4>
                  <p>You can request access to the personal information we hold about you.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Right to Correct:</h4>
                  <p>You can update or correct your profile information at any time through your account settings.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Right to Delete:</h4>
                  <p>You can request deletion of your account and associated data. Some information may be retained for legal or operational purposes.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Right to Opt-Out:</h4>
                  <p>You can opt out of promotional communications at any time.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Right to Data Portability:</h4>
                  <p>You can request your data in a portable format.</p>
                </div>
              </CardContent>
            </Card>

            {/* 6. Cookies and Tracking */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">6. Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our Service. These include:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Cookies that remain on your device to remember your preferences</li>
                  <li><strong>Analytics Cookies:</strong> To understand how you use our Service</li>
                  <li><strong>Authentication Cookies:</strong> To maintain your login session</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our Service.
                </p>
              </CardContent>
            </Card>

            {/* 7. Third-Party Services */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">7. Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our Service uses third-party services that may collect information about you:
                </p>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Google OAuth:</h4>
                  <p>
                    When you sign in with Google, we receive information according to Google's privacy policies. Please review Google's privacy policy at{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://policies.google.com/privacy
                    </a>
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Supabase:</h4>
                  <p>
                    Our data is hosted on Supabase. Please review Supabase's privacy policy at{' '}
                    <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://supabase.com/privacy
                    </a>
                  </p>
                </div>
                <p className="mt-4">
                  We are not responsible for the privacy practices of third-party services. We encourage you to review their privacy policies.
                </p>
              </CardContent>
            </Card>

            {/* 8. Children's Privacy */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">8. Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information and terminate the child's account.
                </p>
              </CardContent>
            </Card>

            {/* 9. Data Retention */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">9. Data Retention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. You can delete your account at any time through your account settings. However, we may retain certain information as required by law or for legitimate business purposes.
                </p>
              </CardContent>
            </Card>

            {/* 10. International Data Transfer */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">10. International Data Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Your information may be transferred to, and maintained on, computers located outside of your state, province, country or other governmental jurisdiction where the privacy laws may not be as protective as those in your jurisdiction. If you are located outside the United States and choose to provide information to us, you consent to the transfer of your information to the United States and its processing there.
                </p>
              </CardContent>
            </Card>

            {/* 11. Changes to This Privacy Policy */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">11. Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by updating the "Last updated" date at the top of this Privacy Policy. Your continued use of our Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
                </p>
              </CardContent>
            </Card>

            {/* 12. Contact Us */}
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="text-2xl">12. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <div className="space-y-2 mt-4">
                  <p><strong>Email:</strong> <a href="mailto:privacy@we4x.com" className="text-primary hover:underline">privacy@we4x.com</a></p>
                  <p><strong>Mail:</strong> We4X Community Connect Hub, Privacy Department</p>
                  <p><strong>Response Time:</strong> We will respond to your inquiry within 30 days</p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="border-t border-border pt-8 text-center text-muted-foreground">
              <p>
                By using We4X Community Connect Hub, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
