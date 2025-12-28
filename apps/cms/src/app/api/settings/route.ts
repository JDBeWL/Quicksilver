import { NextResponse } from 'next/server';
import { getSafeSession } from '@/lib/auth-wrapper';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings';
import { validateApiRequest } from '@/lib/api-security';

export async function GET() {
    try {
        const settings = await getSiteSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const securityError = await validateApiRequest(request);
    if (securityError) return securityError;

    try {
        const session = await getSafeSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const settings = await saveSiteSettings(body);
        
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Save settings error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
