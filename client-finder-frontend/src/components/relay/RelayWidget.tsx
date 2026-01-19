"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";

const QUICK_REPLIES = [
  "What's included?",
  "Pricing?",
  "How fast?",
  "How do I start?",
];

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Want to know if your site is losing customers?",
};

export default function RelayWidget() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
    defaultMatches: false,
  });
  const [showLauncher, setShowLauncher] = useState(false);
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [leadIntent, setLeadIntent] = useState("");
  const streamingIndexRef = useRef<number | null>(null);

  const apiBaseUrl = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_API_BASE_URL;
    const hasPlaceholder =
      configured && configured.includes("YOUR_BACKEND_PORT");
    if (configured && !hasPlaceholder) {
      return configured;
    }
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      return "http://localhost:8787";
    }
    return configured || "";
  }, []);

  useEffect(() => {
    const storedSession = window.localStorage.getItem("relaySessionId");
    if (storedSession) {
      setSessionId(storedSession);
    }
  }, []);

  useEffect(() => {
    const revealTimeout = window.setTimeout(() => setShowLauncher(true), 14000);
    const handleScroll = () => {
      if (window.scrollY > 360) {
        setShowLauncher(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.clearTimeout(revealTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      window.localStorage.setItem("relaySessionId", sessionId);
    }
  }, [sessionId]);

  const setAssistantContent = (content: string) => {
    setMessages((prev) => {
      const idx = streamingIndexRef.current;
      if (idx == null || idx < 0 || idx >= prev.length) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], content };
      return next;
    });
  };

  const removeAssistantPlaceholder = () => {
    setMessages((prev) => {
      const idx = streamingIndexRef.current;
      if (idx == null || idx < 0 || idx >= prev.length) return prev;
      const next = [...prev];
      if (!next[idx]?.content) {
        next.splice(idx, 1);
      }
      return next;
    });
    streamingIndexRef.current = null;
  };

  const beginMessageFlow = (userText: string) => {
    setMessages((prev) => {
      const next = [...prev, { role: "user", content: userText }, { role: "assistant", content: "" }];
      streamingIndexRef.current = next.length - 1;
      return next;
    });
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    if (!apiBaseUrl) {
      setError("Relay is not configured yet.");
      return;
    }

    beginMessageFlow(trimmed);
    setInput("");
    setIsSending(true);
    setError("");
    setLeadIntent("");

    let fullReply = "";

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/x-ndjson",
        },
        body: JSON.stringify({
          sessionId: sessionId || undefined,
          message: trimmed,
          stream: true,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok) {
        let data: any = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }
        const serverMessage = data?.error || "Relay could not reach the server.";
        const detail =
          process.env.NODE_ENV !== "production" && data?.detail
            ? ` (${data.detail})`
            : "";
        throw new Error(`${serverMessage}${detail}`);
      }

      if (contentType.includes("application/x-ndjson") && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let receivedFinal = false;

        while (true) {
          const { done, value } = await reader.read();
          if (value) {
            buffer += decoder.decode(value, { stream: !done });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            for (const line of lines) {
              if (!line.trim()) continue;
              let payload: any;
              try {
                payload = JSON.parse(line);
              } catch {
                continue;
              }
              if (payload.type === "token" && payload.token) {
                fullReply += payload.token;
                setAssistantContent(fullReply);
              } else if (payload.type === "final") {
                receivedFinal = true;
                fullReply = (payload.reply || fullReply || "").trim();
                if (fullReply) {
                  setAssistantContent(fullReply);
                }
                if (payload.sessionId || sessionId) {
                  setSessionId(payload.sessionId || sessionId);
                }
                setLeadIntent(payload.leadIntent || "");
              } else if (payload.type === "error") {
                throw new Error(payload.error || "Relay ran into an error.");
              }
            }
          }
          if (done) break;
        }

        if (!receivedFinal && fullReply) {
          fullReply = fullReply.trim();
          setAssistantContent(fullReply);
        }

        fullReply = fullReply.trim();

        if (!fullReply) {
          throw new Error("Relay did not return a response.");
        }
      } else {
        const data = await response.json();
        if (!data?.reply) {
          throw new Error("Relay did not return a response.");
        }
        fullReply = String(data.reply || "").trim();
        if (!fullReply) {
          throw new Error("Relay did not return a response.");
        }
        setAssistantContent(fullReply);
        setSessionId(data.sessionId || sessionId);
        setLeadIntent(data.leadIntent || "");
      }

      streamingIndexRef.current = null;
    } catch (fetchError) {
      removeAssistantPlaceholder();
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : typeof fetchError === "string"
            ? fetchError
            : "Relay ran into an error.";
      setError(message || "Relay ran into an error.");
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  const scrollToCta = () => {
    const target = document.getElementById("cta");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {showLauncher ? (
        <Fab
          color="default"
          aria-label="Open Relay assistant"
          onClick={() => setOpen(true)}
          size={isMobile ? "small" : "medium"}
          sx={{
            position: "fixed",
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            zIndex: (theme) => theme.zIndex.drawer + 1,
            opacity: open ? 0 : 1,
            pointerEvents: open ? "none" : "auto",
            transition: "opacity 200ms ease",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(15, 23, 42, 0.06)",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <ChatBubbleOutlineIcon />
        </Fab>
      ) : null}
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          BackdropProps: {
            sx: {
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor: "rgba(15, 23, 42, 0.18)",
            },
          },
        }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: isMobile ? 24 : 0,
            borderTopRightRadius: isMobile ? 24 : 0,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            width: isMobile ? "100vw" : { xs: 320, sm: 360 },
            height: isMobile ? "70vh" : "100%",
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
        >
          <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6">Relay</Typography>
              <Typography variant="body2" color="text.secondary">
                Answers questions about the rebuild.
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} aria-label="Close Relay">
              <CloseIcon />
            </IconButton>
          </Stack>
          <Divider />
          <Stack spacing={2} sx={{ px: 2, py: 2, flexGrow: 1, overflowY: "auto" }}>
            {messages.map((message, index) => {
              const isUser = message.role === "user";
              if (!message.content?.trim()) {
                return null;
              }
              return (
                <Box
                  key={`${message.role}-${index}`}
                  sx={{
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    bgcolor: isUser ? "primary.main" : "background.default",
                    color: isUser ? "primary.contrastText" : "text.primary",
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    maxWidth: "85%",
                    border: isUser ? "none" : "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                </Box>
              );
            })}
            {isSending ? (
              <Box
                role="status"
                aria-live="polite"
                aria-label="Relay is typing"
                sx={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "background.default",
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box className="relay-dot" style={{ "--relay-delay": "0ms" } as any} />
                <Box className="relay-dot" style={{ "--relay-delay": "160ms" } as any} />
                <Box className="relay-dot" style={{ "--relay-delay": "320ms" } as any} />
              </Box>
            ) : null}
          </Stack>
          <Box sx={{ px: 2, pb: 2 }}>
            <Stack
              direction="row"
              useFlexGap
              sx={{ mb: 2, flexWrap: "wrap", gap: 1.5 }}
            >
              {QUICK_REPLIES.map((reply) => (
                <Chip
                  key={reply}
                  label={reply}
                  onClick={() => handleQuickReply(reply)}
                  variant="outlined"
                  size="small"
                  disabled={isSending}
                />
              ))}
            </Stack>
            {leadIntent === "ready_to_submit" ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  You can submit your site in the form below.
                </Typography>
                <Button size="small" onClick={scrollToCta} sx={{ mt: 1 }}>
                  Go to form
                </Button>
              </Box>
            ) : null}
            {error ? (
              <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                {error}
              </Typography>
            ) : null}
            <Stack direction="row" spacing={1}>
              <TextField
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about the rebuild..."
                size="small"
                fullWidth
                disabled={isSending}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(input);
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={() => sendMessage(input)}
                disabled={isSending || !input.trim()}
              >
                {isSending ? "..." : "Send"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
