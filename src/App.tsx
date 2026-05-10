/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TooltipProvider } from '@/components/ui/tooltip';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <TooltipProvider>
      <Dashboard />
    </TooltipProvider>
  );
}
