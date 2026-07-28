import type { ReactNode } from 'react'
import {
  Box,
  Button,
  Icon,
  Stack,
  Typography,
  type IconName,
} from '@exotel-npm-dev/signal-design-system'
import channelWhatsapp from '../assets/onboarding/channel-whatsapp.png'
import dsSalesforce from '../assets/onboarding/ds-salesforce.png'
import dsHubspot from '../assets/onboarding/ds-hubspot.png'
import dsSegment from '../assets/onboarding/ds-segment.png'
import dsZoho from '../assets/onboarding/ds-zoho.png'

type OnboardingStep = {
  id: string
  title: string
  description: string
  completed?: boolean
  actionLabel: string
  actionVariant: 'outlined' | 'contained'
  actionColor?: 'inherit' | 'primary' | 'error'
  trailing?: ReactNode
}

const brandBadgeSx = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  bgcolor: 'surface.elevation1',
  border: '1px solid',
  borderColor: 'divider',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const

function BrandBadge({
  children,
  index,
  total,
  label,
}: {
  children: ReactNode
  index: number
  total: number
  label: string
}) {
  return (
    <Box
      aria-label={label}
      sx={{
        ...brandBadgeSx,
        ml: index === 0 ? 0 : '-4px',
        position: 'relative',
        zIndex: total - index,
      }}
    >
      {children}
    </Box>
  )
}

function BrandImageIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
      }}
    />
  )
}

function BrandGlyphIcon({ name }: { name: IconName }) {
  return (
    <Box sx={{ color: 'text.secondary', display: 'flex', lineHeight: 0 }}>
      <Icon name={name} size={18} />
    </Box>
  )
}

function BrandIconStack({
  items,
}: {
  items: Array<{ label: string; src?: string; iconName?: IconName }>
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 32,
      }}
    >
      {items.map((item, index) => (
        <BrandBadge
          key={item.label}
          index={index}
          total={items.length}
          label={item.label}
        >
          {item.src ? (
            <BrandImageIcon src={item.src} alt={item.label} />
          ) : (
            <BrandGlyphIcon name={item.iconName!} />
          )}
        </BrandBadge>
      ))}
    </Box>
  )
}

const steps: OnboardingStep[] = [
  {
    id: 'invite',
    title: 'Invite your team',
    description:
      'Add teammates and set roles — journey designer, approver, analyst. You can do this anytime.',
    completed: true,
    actionLabel: 'Invite',
    actionVariant: 'outlined',
    actionColor: 'inherit',
  },
  {
    id: 'channels',
    title: 'Connect your Channels',
    description:
      'Connect WhatsApp, SMS, Voice & Bots so your journeys can actually reach customers.',
    actionLabel: 'Connect',
    actionVariant: 'contained',
    actionColor: 'primary',
    trailing: (
      <BrandIconStack
        items={[
          { label: 'WhatsApp', src: channelWhatsapp },
          { label: 'SMS', iconName: 'chat-text' },
          { label: 'Voice', iconName: 'phone-call' },
        ]}
      />
    ),
  },
  {
    id: 'datasource',
    title: 'Connect your Data Source and Destinations',
    description:
      'Tell us where your customer data lives, CRM, payment records, webhooks so journeys can pull the right variables.',
    actionLabel: 'Setup',
    actionVariant: 'outlined',
    actionColor: 'inherit',
    trailing: (
      <BrandIconStack
        items={[
          { label: 'Salesforce', src: dsSalesforce },
          { label: 'HubSpot', src: dsHubspot },
          { label: 'Segment', src: dsSegment },
          { label: 'Zoho', src: dsZoho },
        ]}
      />
    ),
  },
  {
    id: 'journey',
    title: 'Build & test your first Journey',
    description:
      'Create one journey end-to-end and run a test execution to confirm everything works before you go live.',
    actionLabel: 'Create',
    actionVariant: 'outlined',
    actionColor: 'inherit',
  },
]

function StepStatus({ completed }: { completed?: boolean }) {
  if (completed) {
    return (
      <Box
        sx={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          bgcolor: 'success.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
        aria-label="Completed"
      >
        <Icon name="check" size={12} color="#FFFFFF" weight="bold" />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: 20,
        height: 20,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: 'divider',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
      aria-hidden
    />
  )
}

function OnboardingStepCard({ step }: { step: OnboardingStep }) {
  return (
    <Box
      sx={{
        bgcolor: 'surface.elevation1',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, gap: 0 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ flex: 1, minWidth: 0 }}
        >
          <StepStatus completed={step.completed} />
          <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                lineHeight: '20px',
              }}
            >
              {step.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ letterSpacing: '0.17px' }}
            >
              {step.description}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0, ml: 1 }}>
          {step.trailing}
          <Button
            variant={step.actionVariant}
            size="small"
            color={step.actionColor ?? 'inherit'}
          >
            {step.actionLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export function OnboardingPage() {
  return (
    <Box
      sx={{
        m: -1,
        width: 'calc(100% + 16px)',
        height: 'calc(100% + 16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'surface.elevation0',
        pt: 5,
        pb: 2,
        px: 1,
        overflow: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ width: '100%', maxWidth: 778 }}
      >
        <Stack spacing={1} alignItems="flex-start" sx={{ width: '100%' }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              letterSpacing: '0.1px',
              fontWeight: 500,
            }}
          >
            Hi Samarth! 👋
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: 24,
              fontWeight: 600,
              lineHeight: 1.235,
              letterSpacing: '0.25px',
              color: 'text.secondary',
              m: 0,
            }}
          >
            Start by setting up your workspace
          </Typography>
        </Stack>

        <Stack spacing={1} sx={{ width: '100%' }}>
          {steps.map((step) => (
            <OnboardingStepCard key={step.id} step={step} />
          ))}
        </Stack>
      </Stack>

      <Stack spacing={1} alignItems="center" sx={{ pt: 2, flexShrink: 0 }}>
        <Button variant="outlined" size="small" color="error">
          Dismiss Onboarding
        </Button>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            lineHeight: '16px',
            fontSize: 12,
          }}
        >
          The onboarding will dismiss automatically when the journey is complete
        </Typography>
      </Stack>
    </Box>
  )
}
