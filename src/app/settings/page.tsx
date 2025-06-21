// src/app/settings/page.tsx

"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { Bell, Palette, Lock, Info, LogOut } from "lucide-react";
import MobileLayout from '../../components/MobileLayout';
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

/**
 * A sleek and modern settings page, providing users with placeholder options
 * to customize their experience. It is designed to be consistent with the
 * application's overall aesthetic, using glassmorphism and smooth animations.
 *
 * @returns {React.ReactElement} The rendered SettingsPage.
 */
export default function SettingsPage(): React.ReactElement {
    // --- Placeholder State for Interactivity ---
    const [pushEnabled, setPushEnabled] = React.useState<boolean>(true);
    const [crisisAlertsEnabled, setCrisisAlertsEnabled] = React.useState<boolean>(true);
    const [mapStyle, setMapStyle] = React.useState<string>("streets-v2");

    // --- Animation Variants with Explicit Typing ---
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } },
    };

    return (
        <MobileLayout>
            <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-6">
                <header className="max-w-3xl mx-auto mb-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl"
                    >
                        Settings
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 mt-2"
                    >
                        Customize your experience and manage your account.
                    </motion.p>
                </header>

                <motion.main
                    className="max-w-3xl mx-auto space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Notifications Section */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</h2>
                        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-100">Push Notifications</h3>
                                    <p className="text-sm text-gray-400">Receive general updates and alerts.</p>
                                </div>
                                <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} aria-label="Toggle Push Notifications"/>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-100">Crisis Alerts</h3>
                                    <p className="text-sm text-gray-400">High-priority alerts for critical events.</p>
                                </div>
                                <Switch checked={crisisAlertsEnabled} onCheckedChange={setCrisisAlertsEnabled} aria-label="Toggle Crisis Alerts"/>
                            </div>
                        </div>
                    </motion.section>

                    {/* Appearance Section */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"><Palette className="h-5 w-5" /> Appearance</h2>
                        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-100">Map Style</h3>
                                    <p className="text-sm text-gray-400">Choose the default map theme.</p>
                                </div>
                                <Select value={mapStyle} onValueChange={setMapStyle}>
                                    <SelectTrigger className="w-[180px] bg-gray-900/50 border-white/20">
                                        <SelectValue placeholder="Select style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="streets-v2">Streets</SelectItem>
                                        <SelectItem value="satellite">Satellite</SelectItem>
                                        <SelectItem value="topo">Topographic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </motion.section>

                    {/* Account Section */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"><Lock className="h-5 w-5" /> Account</h2>
                        <div className="space-y-2 rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg backdrop-blur-sm">
                            <Button variant="ghost" className="w-full justify-start text-base text-gray-200">Change Password</Button>
                            <Button variant="destructive" className="w-full justify-start text-base gap-2"><LogOut className="h-4 w-4"/> Log Out</Button>
                        </div>
                    </motion.section>

                    {/* About Section */}
                    <motion.section variants={itemVariants}>
                        <h2 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"><Info className="h-5 w-5" /> About</h2>
                        <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-gray-300 shadow-lg backdrop-blur-sm">
                            <div className="flex justify-between">
                                <span>App Version</span>
                                <span className="text-gray-400">1.0.0-beta</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Terms of Service</span>
                                <span className="text-blue-400 hover:underline cursor-pointer">→</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Privacy Policy</span>
                                <span className="text-blue-400 hover:underline cursor-pointer">→</span>
                            </div>
                        </div>
                    </motion.section>

                </motion.main>
            </div>
        </MobileLayout>
    );
}