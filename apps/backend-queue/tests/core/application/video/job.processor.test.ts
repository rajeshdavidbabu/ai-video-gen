import { describe, it, expect, beforeEach, vi } from 'vitest';
import { processVideoJob } from '../../../../src/core/application/video/processors/job.processor';
import { createTestServices } from '../../fake-adapters';
import { formFixtures } from '../../fixtures/form.fixture';

describe('processVideoJob', () => {
  const services = createTestServices();

  beforeEach(() => {
    Object.values(services).forEach(service => service._reset?.());
  });

  describe('successful processing', () => {
    it('should return complete video generation result', async () => {
      const jobId = 'test-job-id';
      const fakeJob = services.queue._createFakeJob(jobId);
      
      const formData = {
        ...formFixtures.basic,
        backgroundMusic: 'epic'  // Add background music
      };

      await services.database.createVideoGeneration({
        jobId,
        formData
      });

      const result = await processVideoJob({
        jobId,
        job: fakeJob,
        formData,
        services
      });

      expect(result).toEqual({
        renderUrl: expect.stringContaining('fake-render-url.com'),
        imageUrls: expect.arrayContaining([expect.any(String)]),
        audioUrl: expect.any(String),
        captionsUrl: expect.any(String),
        backgroundMusicUrl: expect.any(String)
      });
    });
  });

//   describe.skip('error handling', () => {
//     it('should handle audio generation failure', async () => {
//       const jobId = 'test-job-id';
//       const fakeJob = services.queue._createFakeJob(jobId);
      
//       // Setup ElevenLabs to fail
//       services.elevenlabs._setFailure(true);

//       await services.database.createVideoGeneration({
//         jobId,
//         formData: formFixtures.basic
//       });

//       await expect(processVideoJob({
//         jobId,
//         job: fakeJob,
//         formData: formFixtures.basic,
//         services
//       })).rejects.toThrow('Failed to generate speech');

//       // Verify job status was updated to failed
//       const generation = (await services.database.getVideoGeneration(jobId))!;
//       expect(generation.status).toBe('failed');
//       expect(generation.step).toBe('audio');
//     });
//   });
});