import { useCallback, useEffect, useRef, useState } from 'react';
import {
  auth,
  ensureBucket,
  getManifest,
  translateObject,
  uploadObject
} from '../services/apsClient';

type Step =
  | 'idle'
  | 'auth'
  | 'bucket'
  | 'upload'
  | 'translate'
  | 'poll'
  | 'ready'
  | 'error';

export interface UseApsPipelineResult {
  step: Step;
  error: string | null;
  urn: string | null;
  start: (file: File, bucketKey: string) => void;
}

export function useApsPipeline(): UseApsPipelineResult {
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState<string | null>(null);
  const [urn, setUrn] = useState<string | null>(null);

  const tokenRef = useRef<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(async (file: File, bucketKey: string) => {
    setError(null);
    setUrn(null);

    try {
      // 1. AUTH -------------------------------------------------------------
      setStep('auth');
      const tok = await auth();
      tokenRef.current = tok.access_token;

      // 2. BUCKET -----------------------------------------------------------
      setStep('bucket');
      await ensureBucket(tok.access_token, bucketKey);

      // 3. UPLOAD -----------------------------------------------------------
      setStep('upload');
      const { objectId } = await uploadObject(
        tok.access_token,
        bucketKey,
        file.name,
        file
      );
      // objectId = urn sin base64 → necesitamos base64 (Forge)
      const base64Urn = btoa(objectId).replace(/=+$/, '');
      setUrn(base64Urn);

      // 4. TRANSLATE --------------------------------------------------------
      setStep('translate');
      await translateObject(tok.access_token, base64Urn, true);

      // 5. POLLING MANIFEST -------------------------------------------------
      setStep('poll');
      const poll = async () => {
        const manifest = await getManifest(tok.access_token, base64Urn);
        if (manifest.status === 'inprogress') return; // keep polling
        if (manifest.status === 'success') {
          setStep('ready');
          if (pollingRef.current) clearInterval(pollingRef.current);
        } else {
          throw new Error('Translation failed');
        }
      };

      pollingRef.current = setInterval(poll, 5_000);
    } catch (err: any) {
      setError(err.message ?? String(err));
      setStep('error');
    }
  }, []);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  return { step, error, urn, start };
}
