import { useState, useEffect } from "react";
import { getSupabaseClient, isSupabaseConfigured, supabaseUrl } from "../lib/supabase/client";

export default function SupabaseTest() {
  const [session, setSession] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  
  // Results states
  const [testConnectionResult, setTestConnectionResult] = useState<string>("");
  const [createTestUserResult, setCreateTestUserResult] = useState<string>("");
  const [createTestUserError, setCreateTestUserError] = useState<string>("");

  const rawEnvUrl = import.meta.env.VITE_SUPABASE_URL || "NOT DEFINED";
  const clientInitialized = isSupabaseConfigured && getSupabaseClient() !== null;

  // Retrieve current active session on load
  const fetchSession = async () => {
    setSessionLoading(true);
    const client = getSupabaseClient();
    if (!client) {
      setSession(null);
      setSessionLoading(false);
      return;
    }
    try {
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.warn("Status getting session:", error);
        setSession(`Error: ${error.message}`);
      } else {
        setSession(data.session);
      }
    } catch (err: any) {
      setSession(`Exception: ${err.message || err}`);
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  // Action: Test Connection
  const handleTestConnection = async () => {
    setTestConnectionResult("Testing connection in progress...");
    const client = getSupabaseClient();
    if (!client) {
      setTestConnectionResult("Failed - Supabase client is null (credentials not properly loaded).");
      return;
    }
    try {
      const { data, error } = await client.auth.getSession();
      if (error) {
        setTestConnectionResult(`Error returned: ${JSON.stringify(error, null, 2)}`);
      } else {
        setTestConnectionResult(`Success! Session check OK. Active session found: ${data.session !== null}\nData: ${JSON.stringify(data, null, 2)}`);
        // Refresh session
        setSession(data.session);
      }
    } catch (err: any) {
      setTestConnectionResult(`Exception caught during session request: ${err.message || err}`);
    }
  };

  // Action: Create Test User
  const handleCreateTestUser = async () => {
    setCreateTestUserResult("Creating test user in progress...");
    setCreateTestUserError("");
    const client = getSupabaseClient();
    if (!client) {
      setCreateTestUserError("Failed - Supabase client is null (credentials not properly loaded).");
      setCreateTestUserResult("");
      return;
    }

    // Hardcoded test email and password
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "SuperSecurePassword123!";

    try {
      const { data, error } = await client.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setCreateTestUserError(JSON.stringify(error, null, 2));
        setCreateTestUserResult("");
      } else {
        setCreateTestUserResult(JSON.stringify(data, null, 2));
        setCreateTestUserError("");
      }
    } catch (err: any) {
      setCreateTestUserError(`Exception during signUp: ${err?.message || JSON.stringify(err)}`);
      setCreateTestUserResult("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white border border-neutral-200 rounded-xl shadow-sm text-neutral-800 font-sans">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2 border-b border-neutral-100 pb-3">
        Supabase Integration Test Bench
      </h1>
      
      {/* Configuration overview */}
      <div className="mb-6 space-y-2 bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs font-mono">
        <div>
          <span className="font-semibold text-neutral-500">Loaded Env Supabase URL:</span>{" "}
          <span className="text-neutral-600 font-bold select-all">{rawEnvUrl}</span>
        </div>
        <div>
          <span className="font-semibold text-neutral-500">Sanitized Client URL:</span>{" "}
          <span className="text-blue-600 font-bold select-all">{supabaseUrl}</span>
        </div>
        <div>
          <span className="font-semibold text-neutral-500">Client Initialized Successfully?</span>{" "}
          <span className={`font-bold ${clientInitialized ? "text-emerald-600" : "text-red-500"}`}>
            {clientInitialized ? "YES" : "NO"}
          </span>
        </div>
        <div>
          <span className="font-semibold text-neutral-500">Current Session State:</span>{" "}
          {sessionLoading ? (
            <span className="text-neutral-400 italic">Checking session...</span>
          ) : session ? (
            <pre className="mt-1.5 p-2 bg-neutral-900 text-neutral-100 rounded text-[10px] overflow-auto max-h-32 whitespace-pre-wrap leading-tight select-all">
              {typeof session === "string" ? session : JSON.stringify(session, null, 2)}
            </pre>
          ) : (
            <span className="text-orange-500 font-bold">No Active Session (User Logged Out)</span>
          )}
        </div>
      </div>

      {/* Buttons Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={handleTestConnection}
          className="px-4 py-2 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition text-sm cursor-pointer"
        >
          Test Supabase Connection
        </button>
        <button
          onClick={handleCreateTestUser}
          className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition text-sm cursor-pointer"
        >
          Create Test User
        </button>
      </div>

      {/* Display Results */}
      <div className="space-y-4 text-xs font-mono">
        {/* Test Connection Results */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-bold text-neutral-700 uppercase tracking-wider mb-2 text-[10px]">
            Connection Test Logs:
          </h3>
          {testConnectionResult ? (
            <pre className="p-3 bg-neutral-900 text-neutral-200 rounded overflow-x-auto whitespace-pre-wrap max-h-48">
              {testConnectionResult}
            </pre>
          ) : (
            <p className="text-neutral-400 italic">Click "Test Supabase Connection" to trigger auth request.</p>
          )}
        </div>

        {/* Create Test User Results */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-bold text-neutral-700 uppercase tracking-wider mb-2 text-[10px]">
            User Creation Response Payload:
          </h3>
          {createTestUserResult ? (
            <pre className="p-3 bg-emerald-950 text-emerald-250 border border-emerald-900 rounded overflow-x-auto whitespace-pre-wrap max-h-64">
              {createTestUserResult}
            </pre>
          ) : (
            <p className="text-neutral-400 italic">Click "Create Test User" to run signUp() operation.</p>
          )}
        </div>

        {/* Create Test User Errors */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-bold text-red-700 uppercase tracking-wider mb-2 text-[10px]">
            User Creation Error Payload:
          </h3>
          {createTestUserError ? (
            <pre className="p-3 bg-rose-950 text-rose-250 border border-rose-900 rounded overflow-x-auto whitespace-pre-wrap max-h-64">
              {createTestUserError}
            </pre>
          ) : (
            <p className="text-neutral-400 italic">Any errors encountered during signup will appear here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
