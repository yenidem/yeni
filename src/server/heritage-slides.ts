import {Request, Response} from 'express';
import {HERITAGE_SLIDES_DATA} from '../app/features/heritage-slider/data/heritage-slides.data';

export function registerHeritageSlidesRoutes(app: {
  get: (path: string, handler: (req: Request, res: Response) => void) => void;
}): void {
  app.get('/api/heritage-slides', (_req: Request, res: Response) => {
    res.json({
      success: true,
      count: HERITAGE_SLIDES_DATA.length,
      slides: HERITAGE_SLIDES_DATA,
    });
  });
}
