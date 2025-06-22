/**
 * Digital wallet demo page.
 */

"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { ScanLine } from "lucide-react";

import MobileLayout from '../../components/MobileLayout'; // Assuming this path is correct

/**
 * A subtle, thematic grid pattern to be used as a background texture.
 * This adds a layer of sophistication without breaking the color palette.
 *
 * @returns {React.ReactElement} The SVG grid pattern.
 */
const ThematicGridPattern = (): React.ReactElement => (
    <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full fill-white/10 stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
    >
      <defs>
        <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            x="100%"
            y="100%"
            patternTransform="translate(-0.5 -0.5)"
        >
          <path d="M.5 40V.5H40" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid)" />
    </svg>
);


/**
 * The main Wallet page, redesigned to be consistent with the application's
 * established "glassmorphism" and color palette. It features a clean, professional
 * presentation with a glowing QR code and subtle thematic details.
 *
 * @returns {React.ReactElement} The rendered WalletPage component.
 */
export default function WalletPage(): React.ReactElement {
  // --- Component State & Data ---
  const name = "Alex Müller";
  const operatorId = "EUM-7B42-A9F1";
  const [qrValue] = React.useState(`passport-v1:${operatorId}:${Date.now()}`);

  return (
      <MobileLayout>
        <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-950 p-4">
          <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              // This card now uses the exact same styling principles as the NewsCard
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-black/30 shadow-2xl backdrop-blur-md"
          >
            {/* Subtle thematic background pattern instead of the loud gradient */}
            <div className="absolute inset-0 z-0 h-full w-full opacity-30">
              <ThematicGridPattern />
            </div>

            {/* Card Content Layer */}
            <div className="relative z-10 flex flex-col space-y-6 p-6">
              <header className="flex items-center justify-between text-white">
                <span className="text-lg font-bold tracking-wider text-gray-100">EUROMESH</span>
                <span className="text-xs font-semibold uppercase text-blue-300">Digital Passport</span>
              </header>

              <div className="space-y-4 text-center">
                <div>
                  <p className="text-sm text-blue-300/80">Operator Name</p>
                  <p className="text-2xl font-medium tracking-wide text-gray-50">{name}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-300/80">Operator ID</p>
                  <p className="font-mono text-lg text-gray-50">{operatorId}</p>
                </div>
              </div>

              {/* QR Code Section with glowing effect, using the consistent blue accent */}
              <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px 0px rgba(59, 130, 246, 0.3)",
                      "0 0 25px 4px rgba(59, 130, 246, 0.3)",
                      "0 0 0px 0px rgba(59, 130, 246, 0.3)",
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                  className="mx-auto rounded-2xl bg-black/20 p-4"
              >
                <QRCodeSVG
                    value={qrValue}
                    size={256}
                    level="Q"
                    bgColor="transparent"
                    fgColor="#f9fafb" // Use off-white for better contrast and feel
                    className="rounded-lg"
                />
              </motion.div>

              <footer className="flex items-center justify-center gap-2 text-center text-xs text-gray-400">
                <ScanLine className="h-4 w-4" />
                <span>Present this for one-time verification</span>
              </footer>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
  );
}