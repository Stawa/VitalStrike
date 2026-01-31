import React, { useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";

interface ConfigSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function ConfigSection({
  id,
  title,
  icon,
  description,
  children,
  className = "",
}: Readonly<ConfigSectionProps>) {
  return (
    <section id={id} className={`relative ${className}`}>
      <div className="relative flex items-center mb-8">
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
        <div className="flex items-center flex-shrink-0 mx-4">
          <div className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-primary/15 bg-primary/10 text-primary-700 shadow-sm dark:text-primary-300">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      </div>

      <div className="mb-6 text-gray-600 dark:text-gray-400">
        <p>{description}</p>
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

interface ConfigBlockProps {
  title: string;
  filename: string;
  code: string;
  tip?: string;
  className?: string;
}

export function ConfigBlock({
  title,
  filename,
  code,
  tip,
  className = "",
}: Readonly<ConfigBlockProps>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
          {filename}
        </span>
      </div>

      <div className="relative">
        <div className="p-5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 relative">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 rounded-md bg-white dark:bg-gray-800 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
            title="Copy to clipboard"
          >
            {copied ? <FaCheck size={14} className="text-green-500" /> : <FaRegCopy size={14} />}
          </button>

          <pre className="overflow-x-auto language-yaml p-0 bg-transparent">
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200 language-yaml">
              {code}
            </code>
          </pre>
        </div>
      </div>

      {tip && (
        <div className="p-5 text-sm bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-200 flex items-start border-t border-gray-200 dark:border-gray-800">
          <span className="text-primary-600 dark:text-primary-400 mr-3 mt-0.5 flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <p>{tip}</p>
        </div>
      )}
    </div>
  );
}
