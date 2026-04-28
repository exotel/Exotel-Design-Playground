import { useState, useCallback } from 'react'
import {
  Box,
  Button,
  ChatInputBox,
  Icon,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@exotel-npm-dev/signal-design-system'
import type {
  ChatInputAttachment,
  IconName,
  MentionSuggestion,
} from '@exotel-npm-dev/signal-design-system'

const allSuggestions: MentionSuggestion[] = [
  { id: 'c1', label: 'Sales Campaign', secondary: 'Campaign' },
  { id: 'c2', label: 'Inbound Campaign', secondary: 'Campaign' },
  { id: 'c3', label: 'Outbound Sales', secondary: 'Campaign' },
  { id: 'q1', label: 'Support Queue', secondary: 'Queue' },
  { id: 'q2', label: 'Premium Support Queue', secondary: 'Queue' },
  { id: 'p1', label: 'Main Process', secondary: 'Process' },
]

interface QuickAction {
  label: string
  iconName: IconName
  iconColor: string
}

const quickActions: QuickAction[] = [
  { label: 'Duplicate Campaign', iconName: 'copy', iconColor: '#4caf50' },
  { label: 'Add Agents to Campaigns and Queues', iconName: 'users', iconColor: '#03a9f4' },
  { label: 'View breached SLAs yesterday', iconName: 'target', iconColor: '#7f56d9' },
  { label: 'Create Queues in Campaign', iconName: 'list-bullets', iconColor: '#fdb022' },
]

export function AIChatPage() {
  const [value, setValue] = useState('')
  const [attachments, setAttachments] = useState<ChatInputAttachment[]>([])
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([])
  const [mentionLoading, setMentionLoading] = useState(false)

  const handleMentionSearch = useCallback((query: string) => {
    setMentionLoading(true)
    setTimeout(() => {
      setSuggestions(
        allSuggestions.filter((s) =>
          s.label.toLowerCase().includes(query.toLowerCase())
        )
      )
      setMentionLoading(false)
    }, 300)
  }, [])

  const handleMentionSelect = useCallback((suggestion: MentionSuggestion) => {
    console.log('Mention selected:', suggestion)
  }, [])

  const handleSend = useCallback(
    (text: string, atts: ChatInputAttachment[]) => {
      console.log('Sent:', { text, attachments: atts })
    },
    []
  )

  const handleAttach = useCallback((files: File[]) => {
    const newAttachments = files.map((file) => ({
      id: String(Date.now()) + file.name,
      name: file.name,
      type: file.type,
      size: file.size,
      file,
    }))
    setAttachments((prev) => [...prev, ...newAttachments])
  }, [])

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const handleQuickAction = useCallback((label: string) => {
    setValue(label)
    console.log('Quick action:', label)
  }, [])

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'surface.elevation1',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
        }}
      >
        <Stack direction="row" spacing={1}>
          <IconButton size="small" aria-label="Chat history">
            <Icon name="list" size="sm" />
          </IconButton>
          <IconButton size="small" aria-label="New chat">
            <Icon name="note-pencil" size="sm" />
          </IconButton>
        </Stack>
        <IconButton size="small" aria-label="Toggle panel">
          <Icon name="square-half" size="sm" />
        </IconButton>
      </Box>

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3.75,
          overflow: 'auto',
          px: 2,
        }}
      >
        {/* Empty state */}
        <Stack spacing={2} alignItems="center" sx={{ maxWidth: 700, width: 608 }}>
          {/* Logo mark */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              background: 'linear-gradient(219deg, #394FB6 5%, #5E79D5 51%, #394FB6 96%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0px 1.5px 1.5px -0.5px rgba(10,13,18,0.13), 0px 1.5px 4.5px 0px rgba(10,13,18,0.1), 0px 1.5px 3px 0px rgba(10,13,18,0.06)',
            }}
          >
            <Icon color='white' name="sparkle" size="md" />
          </Box>

          {/* Greeting and title */}
          <Stack spacing={1} alignItems="center">
            <Typography variant="subtitle1">
              Hi Samarth,
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
              Configure your Contact Center with AI
            </Typography>
          </Stack>

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            Describe the change you want to make: campaigns, queues, agents,
            routing, or reports. I'll generate a plan and apply it for you.
          </Typography>
        </Stack>

        {/* Chat input box */}
        <ChatInputBox
          value={value}
          onChange={setValue}
          placeholder="Type @ to select processes, campaigns and queues you want to configure"
          maxLength={25}
          attachments={attachments}
          onAttach={handleAttach}
          onRemoveAttachment={handleRemoveAttachment}
          mentionSuggestions={suggestions}
          onMentionSearch={handleMentionSearch}
          onMentionSelect={handleMentionSelect}
          mentionLoading={mentionLoading}
          onSend={handleSend}
        />

        {/* Quick action suggestions */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
            maxWidth: 540,
          }}
        >
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outlined"
              size="small"
              startIcon={
                <Box component="span" sx={{ color: action.iconColor, display: 'flex' }}>
                  <Icon name={action.iconName} size="sm" />
                </Box>
              }
              onClick={() => handleQuickAction(action.label)}
              sx={{
                color: 'text.primary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'action.hover',
                  bgcolor: 'action.hover',
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Footer disclaimer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          py: 1,
          px: 1,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          AI can make mistakes, always verify.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          component="a"
          onClick={(e: React.MouseEvent) => e.preventDefault()}
        >
          Send Feedback
        </Typography>
      </Box>
    </Paper>
  )
}
