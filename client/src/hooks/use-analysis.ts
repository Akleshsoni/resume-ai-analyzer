import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AnalysisResponse } from "@shared/routes";

export function useAnalyzeResume() {
  return useMutation<AnalysisResponse, Error, { resume: File; jobDescription: string }>({
    mutationFn: async ({ resume, jobDescription }) => {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const res = await fetch(api.analyze.path, {
        method: api.analyze.method,
        body: formData, // fetch automatically sets Content-Type to multipart/form-data with boundary
        // No "Content-Type" header needed manually for FormData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to analyze resume");
      }

      // We manually parse here because our shared schema might be strict about exact shapes
      // and the backend might return extra fields or formatted slightly differently.
      // Ideally we use api.analyze.responses[200].parse(await res.json()), but for file uploads
      // and complex AI responses, let's trust the successful 200 response for now 
      // or implement robust error handling.
      return await res.json() as AnalysisResponse;
    },
  });
}
