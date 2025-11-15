const axios = require('axios');

class EmailService {
    constructor() {
        // Azure Logic App HTTP trigger URL will be set via environment variable
        this.logicAppUrl = process.env.LOGIC_APP_WEBHOOK_URL;
    }

    /**
     * Send welcome email to newly registered donor
     * @param {Object} donor - Donor information
     * @param {string} donor.email - Donor's email address
     * @param {string} donor.firstName - Donor's first name
     * @param {string} donor.lastName - Donor's last name
     */
    async sendDonorWelcomeEmail(donor) {
        if (!this.logicAppUrl) {
            console.warn('Logic App webhook URL not configured. Skipping email.');
            return;
        }

        try {
            const emailData = {
                emailType: 'donor_welcome',
                recipientEmail: donor.email,
                recipientName: `${donor.firstName} ${donor.lastName}`,
                firstName: donor.firstName,
                lastName: donor.lastName,
                subject: 'Welcome to Obayi - Thank You for Joining Our Community!',
                templateData: {
                    greeting: `Dear ${donor.firstName}`,
                    bodyContent: `
                        <p>Thank you for registering as a donor with Obayi!</p>

                        <p>We are thrilled to have you join our community of generous donors who are making a real difference in students' lives.</p>

                        <h3>What's Next?</h3>
                        <ul>
                            <li>Complete your profile to help us match you with students</li>
                            <li>Browse available students who need support</li>
                            <li>Our admin team will review your profile and create matches</li>
                            <li>You'll receive updates about your assigned students</li>
                        </ul>

                        <p>If you have any questions, please don't hesitate to reach out to our team.</p>

                        <p>Thank you for your generosity and commitment to education!</p>

                        <p>Best regards,<br/>
                        The Obayi Team</p>
                    `
                }
            };

            await axios.post(this.logicAppUrl, emailData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });

            console.log(`Welcome email sent to donor: ${donor.email}`);
        } catch (error) {
            console.error('Failed to send donor welcome email:', error.message);
            // Don't throw error - email failure shouldn't block registration
        }
    }

    /**
     * Send welcome email to newly registered student
     * @param {Object} student - Student information
     * @param {string} student.email - Student's email address
     * @param {string} student.firstName - Student's first name
     * @param {string} student.lastName - Student's last name
     * @param {string} student.studentId - Student's ID
     * @param {string} student.school - Student's school name
     */
    async sendStudentWelcomeEmail(student) {
        if (!this.logicAppUrl) {
            console.warn('Logic App webhook URL not configured. Skipping email.');
            return;
        }

        try {
            const emailData = {
                emailType: 'student_welcome',
                recipientEmail: student.email,
                recipientName: `${student.firstName} ${student.lastName}`,
                firstName: student.firstName,
                lastName: student.lastName,
                studentId: student.studentId,
                subject: 'Welcome to Obayi - Your Educational Journey Starts Here!',
                templateData: {
                    greeting: `Dear ${student.firstName}`,
                    bodyContent: `
                        <p>Welcome to Obayi! We're excited to have you join our community of students.</p>

                        <p><strong>Your Student ID:</strong> ${student.studentId}</p>
                        ${student.school ? `<p><strong>School:</strong> ${student.school}</p>` : ''}

                        <h3>What's Next?</h3>
                        <ul>
                            <li>Complete your profile with your educational information</li>
                            <li>Upload any relevant documents (certificates, receipts, etc.)</li>
                            <li>Our team will work to match you with generous donors</li>
                            <li>You'll be notified when a donor is assigned to support you</li>
                        </ul>

                        <p>We're here to support your educational journey. If you have any questions or need assistance, please reach out to us.</p>

                        <p>Best wishes for your studies!</p>

                        <p>Best regards,<br/>
                        The Obayi Team</p>
                    `
                }
            };

            await axios.post(this.logicAppUrl, emailData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            console.log(`Welcome email sent to student: ${student.email}`);
        } catch (error) {
            console.error('Failed to send student welcome email:', error.message);
            // Don't throw error - email failure shouldn't block registration
        }
    }

    /**
     * Send assignment notification email to donor
     * @param {Object} data - Assignment data
     */
    async sendDonorAssignmentEmail(data) {
        if (!this.logicAppUrl) {
            console.warn('Logic App webhook URL not configured. Skipping email.');
            return;
        }

        try {
            const emailData = {
                emailType: 'donor_assignment',
                recipientEmail: data.donorEmail,
                recipientName: `${data.donorFirstName} ${data.donorLastName}`,
                subject: 'New Student Assignment - Obayi',
                templateData: {
                    greeting: `Dear ${data.donorFirstName}`,
                    bodyContent: `
                        <p>Great news! A student has been assigned to you on the Obayi platform.</p>

                        <h3>Student Information:</h3>
                        <ul>
                            <li><strong>Name:</strong> ${data.studentFirstName} ${data.studentLastName}</li>
                            <li><strong>School:</strong> ${data.studentSchool || 'Not specified'}</li>
                            <li><strong>Grade Level:</strong> ${data.studentGradeLevel || 'Not specified'}</li>
                        </ul>

                        <p>You can now view the student's profile, documents, and progress through your donor dashboard.</p>

                        <p><a href="https://ambitious-mushroom-03632ab03.6.azurestaticapps.net/dashboard" style="background-color: #0891b2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a></p>

                        <p>Thank you for your continued support!</p>

                        <p>Best regards,<br/>
                        The Obayi Team</p>
                    `
                }
            };

            await axios.post(this.logicAppUrl, emailData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            console.log(`Assignment notification sent to donor: ${data.donorEmail}`);
        } catch (error) {
            console.error('Failed to send donor assignment email:', error.message);
        }
    }

    /**
     * Send assignment notification email to student
     * @param {Object} data - Assignment data
     */
    async sendStudentAssignmentEmail(data) {
        if (!this.logicAppUrl) {
            console.warn('Logic App webhook URL not configured. Skipping email.');
            return;
        }

        try {
            const emailData = {
                emailType: 'student_assignment',
                recipientEmail: data.studentEmail,
                recipientName: `${data.studentFirstName} ${data.studentLastName}`,
                subject: 'New Donor Assignment - Obayi',
                templateData: {
                    greeting: `Dear ${data.studentFirstName}`,
                    bodyContent: `
                        <p>Wonderful news! A donor has been assigned to support your educational journey.</p>

                        <h3>Donor Information:</h3>
                        <ul>
                            <li><strong>Name:</strong> ${data.donorFirstName} ${data.donorLastName}</li>
                            <li><strong>Organization:</strong> ${data.donorOrganization || 'Individual donor'}</li>
                        </ul>

                        <p>Your donor is committed to supporting your educational goals. Make sure to keep your profile updated and upload any relevant documents to share your progress.</p>

                        <p><a href="https://ambitious-mushroom-03632ab03.6.azurestaticapps.net/dashboard" style="background-color: #0891b2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a></p>

                        <p>Keep up the great work!</p>

                        <p>Best regards,<br/>
                        The Obayi Team</p>
                    `
                }
            };

            await axios.post(this.logicAppUrl, emailData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            console.log(`Assignment notification sent to student: ${data.studentEmail}`);
        } catch (error) {
            console.error('Failed to send student assignment email:', error.message);
        }
    }
}

module.exports = new EmailService();
