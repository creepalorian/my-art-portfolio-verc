import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { name, email, subject, message } = await request.json();

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (message.length < 10) {
            return NextResponse.json(
                { error: 'Message must be at least 10 characters' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Map subject values to readable labels
        const subjectLabels: Record<string, string> = {
            general: 'General Inquiry',
            commission: 'Commission Request',
            collaboration: 'Collaboration',
            press: 'Press/Media'
        };

        const subjectLabel = subjectLabels[subject] || subject;

        // Send email via Resend
        await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Resend's default sender
            to: 'creepalorian@gmail.com',
            replyTo: email, // User can reply directly to the sender
            subject: `Contact Form: ${subjectLabel}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong>From:</strong> ${name}
            </p>
            <p style="margin: 10px 0;">
              <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
            </p>
            <p style="margin: 10px 0;">
              <strong>Subject:</strong> ${subjectLabel}
            </p>
          </div>
          
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Submitted on ${new Date().toLocaleString('en-US', {
                dateStyle: 'full',
                timeStyle: 'short',
                timeZone: 'Asia/Singapore'
            })}
          </p>
        </div>
      `
        });

        console.log('Contact form email sent successfully:', {
            name,
            email,
            subject: subjectLabel,
            timestamp: new Date().toISOString()
        });

        return NextResponse.json(
            { success: true, message: 'Message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
}
