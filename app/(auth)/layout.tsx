'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import Script from 'next/script'
import { usePathname } from 'next/navigation'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme } = useTheme()

  const pathname = usePathname()

  // Force light theme on mount and on path changes
  useEffect(() => {
    // Set theme to light and ensure dark class is removed
    setTheme('light')
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')
    
    // Add a class to the body to indicate we're in auth pages
    document.body.classList.add('auth-page')
    
    // Initialize Google Translate
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    googleTranslateScript.async = true;
    
    // Add the initialization function
    const initTranslate = () => {
      // @ts-ignore - Google Translate API
      window.googleTranslateElementInit = function() {
        // @ts-ignore - Google Translate API
        new window.google.translate.TranslateElement(
          { 
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,ja,ko,hi',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      };
      
      // Add the script to the document
      document.body.appendChild(googleTranslateScript);
    };
    
    // Only initialize if not already loaded
    if (!window.google?.translate) {
      initTranslate();
    }
    
    return () => {
      // Cleanup function to remove the script if component unmounts
      if (googleTranslateScript.parentNode) {
        googleTranslateScript.parentNode.removeChild(googleTranslateScript)
      }
      // Cleanup auth page class
      document.body.classList.remove('auth-page')
      // @ts-ignore
      if (window.googleTranslateElementInit) {
        // @ts-ignore
        delete window.googleTranslateElementInit;
      }
    };
  }, [setTheme]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Google Translate Element */}
      <div className="fixed top-4 right-4 z-50" id="google_translate_element"></div>
      
      {/* Google Translate Script */}
      <Script
        id="google-translate-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,de,it,pt,ru,zh-CN,ja,ko,hi',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `,
        }}
      />
      
      {children}
    </div>
  )
}
