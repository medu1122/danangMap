'use client';

import { useTroData } from './TroProvider';
import { Bell, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewDataNotification() {
  const { newDataNotification, refetch, dismissNotification } = useTroData();

  return (
    <AnimatePresence>
      {newDataNotification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[99999] bg-gradient-to-r from-[#52B788] to-[#00B4D8] text-white px-4 py-3 shadow-lg"
        >
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bell className="w-5 h-5" />
              </div>
              <p className="font-medium">{newDataNotification.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  refetch();
                  dismissNotification();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Cập nhật
              </button>
              <button
                onClick={dismissNotification}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Đóng thông báo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
