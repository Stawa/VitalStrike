import React from "react";
import { FaRegCopy } from "react-icons/fa";

interface ConfigSectionProps {
  id: string;
  title: string;
  icon: string;
  description: string;
  children: React.ReactNode;
}

export function ConfigSection({
  id,
  title,
  icon,
  description,
  children,
}: Readonly<ConfigSectionProps>) {
  return (
    <section
      id={id}
      className="scroll-mt-16 border-t border-gray-100 dark:border-gray-800 pt-8"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">{icon}</span>
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{description}</p>
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
}

export function ConfigBlock({
  title,
  filename,
  code,
  tip,
}: Readonly<ConfigBlockProps>) {
  return (
    <div className="bg-white dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {filename}
          </span>
          <button className="text-gray-400 hover:text-primary-500 transition-colors">
            <FaRegCopy size={14} />
          </button>
        </div>
        <pre className="overflow-x-auto">
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
            {code}
          </code>
        </pre>
      </div>

      {tip && (
        <div className="p-4 text-sm text-gray-600 dark:text-gray-400 flex items-start">
          <span className="text-primary-500 dark:text-primary-400 mr-2 mt-0.5">
            💡
          </span>
          <p>{tip}</p>
        </div>
      )}
    </div>
  );
}
