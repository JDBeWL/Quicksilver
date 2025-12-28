import Link from 'next/link';
import { getSafeSession } from '@/lib/auth-wrapper'; // Use safe session getter
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, PenTool } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton'; // Client component for logout action
import { getDictionary } from '@/get-dictionary';
import { Locale } from '@/i18n-config';

// Force dynamic rendering for navbar due to auth session usage
export const dynamic = 'force-dynamic';

export default async function Navbar({ lang }: { lang: Locale }) {
    const session = await getSafeSession();
    const dict = await getDictionary(lang);

    return (
        <header className="border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="w-full px-4 sm:px-6 lg:px-10 flex h-14 items-center justify-between">
                <Link href={`/${lang}`} className="flex items-center font-black text-xl tracking-tight">
                    <span className="text-foreground">{dict.navbar.brand}</span>
                </Link>
                <nav className="flex items-center gap-2 sm:gap-4">
                    <Link href={`/${lang}/about`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hidden sm:block">
                        {dict.navbar.about}
                    </Link>
                    {session ? (
                        <>
                            <Button variant="ghost" size="sm" asChild className="text-foreground hover:text-foreground hover:bg-foreground/5 font-medium hidden sm:flex">
                                <Link href={`/${lang}/dashboard/create`}>
                                    <PenTool className="mr-1.5 h-4 w-4" />
                                    {dict.navbar.write}
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild className="text-foreground hover:bg-foreground/5 sm:hidden h-8 w-8">
                                <Link href={`/${lang}/dashboard/create`}>
                                    <PenTool className="h-4 w-4" />
                                </Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                            <AvatarFallback className="bg-foreground text-background font-medium text-sm">
                                                {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48 border border-foreground/10 bg-card" align="end" forceMount>
                                    <DropdownMenuItem asChild className="hover:bg-foreground/5 focus:bg-foreground/5 sm:hidden">
                                        <Link href={`/${lang}/about`} className="flex items-center gap-2">
                                            {dict.navbar.about}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="hover:bg-foreground/5 focus:bg-foreground/5">
                                        <Link href={`/${lang}/dashboard`} className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {dict.navbar.dashboard}
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="hover:bg-foreground/5 focus:bg-foreground/5">
                                        <div>
                                            <LogoutButton text={dict.navbar.logout} />
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild className="text-foreground hover:text-foreground hover:bg-foreground/5 font-medium">
                                <Link href={`/${lang}/login`}>{dict.navbar.login}</Link>
                            </Button>
                            {process.env.BLOG_MODE === 'multi_user' && (
                                <Button variant="outline" size="sm" asChild className="border-foreground/20 hover:bg-foreground hover:text-background hover:border-foreground font-medium">
                                    <Link href={`/${lang}/register`}>{dict.navbar.register}</Link>
                                </Button>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
