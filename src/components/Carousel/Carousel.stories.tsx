import type { Meta, StoryObj } from '@storybook/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselCounter,
} from './Carousel';
import { Card, CardHeader, CardTitle, CardBody } from '../Card';

const meta: Meta<typeof Carousel> = {
  title: 'Data Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the carousel track',
    },
    loop: {
      control: 'boolean',
      description: 'Whether the carousel wraps around seamlessly',
    },
    autoplay: {
      control: 'boolean',
      description: 'Enable automatic slide cycling',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Pause autoplay when hovering over carousel',
    },
    itemsPerView: {
      control: { type: 'number', min: 1, max: 4, step: 1 },
      description: 'Number of items visible simultaneously',
    },
    draggable: {
      control: 'boolean',
      description: 'Enable mouse and touch drag gestures',
    },
    wheel: {
      control: 'boolean',
      description: 'Enable mouse wheel / trackpad gesture navigation',
    },
    duration: {
      control: { type: 'number', min: 100, max: 1200, step: 50 },
      description: 'Transition duration in milliseconds',
    },
  },
  args: {
    orientation: 'horizontal',
    loop: false,
    autoplay: false,
    pauseOnHover: true,
    itemsPerView: 1,
    draggable: true,
    wheel: true,
    duration: 450,
  },
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const sampleSlides = [
  {
    title: 'Modern Soft UI Experience',
    desc: 'Soft shadows, tactile depth, and subtle transitions crafted for modern interfaces.',
    bg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
    badge: 'Design System',
  },
  {
    title: 'Accessible & Ergonomic',
    desc: 'Fully compliant with WCAG AA accessibility, keyboard navigation, and ARIA landmarks.',
    bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
    badge: 'Accessibility',
  },
  {
    title: 'High Performance React 19',
    desc: 'Optimized bundle size, zero external runtime baggage, and hardware-accelerated CSS.',
    bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
    badge: 'Performance',
  },
  {
    title: 'Dark Mode by Default',
    desc: 'Flawless ambient dark mode adaptation without high-contrast ocular fatigue.',
    bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
    badge: 'Theming',
  },
];

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <Carousel {...args}>
        <CarouselContent>
          {sampleSlides.map((slide, i) => (
            <CarouselItem key={i}>
              <Card
                variant="elevated"
                style={{
                  height: 220,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: slide.bg,
                }}
              >
                <CardHeader>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--eta-color-primary)',
                    }}
                  >
                    {slide.badge}
                  </span>
                  <CardTitle>{slide.title}</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ margin: 0, color: 'var(--eta-text-muted)' }}>{slide.desc}</p>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselCounter />
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    loop: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '1rem' }}>
      <Carousel {...args} height={320}>
        <CarouselContent>
          {sampleSlides.map((slide, i) => (
            <CarouselItem key={i}>
              <Card
                variant="elevated"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: slide.bg,
                }}
              >
                <CardHeader>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--eta-color-primary)',
                    }}
                  >
                    {slide.badge}
                  </span>
                  <CardTitle>{slide.title}</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ margin: 0, color: 'var(--eta-text-muted)' }}>{slide.desc}</p>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

export const WithLoop: Story = {
  args: {
    loop: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <Carousel {...args}>
        <CarouselContent>
          {sampleSlides.map((slide, i) => (
            <CarouselItem key={i}>
              <Card
                variant="elevated"
                style={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: slide.bg,
                }}
              >
                <CardHeader>
                  <CardTitle>{slide.title}</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ margin: 0, color: 'var(--eta-text-muted)' }}>{slide.desc}</p>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselCounter />
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

export const Autoplay: Story = {
  args: {
    loop: true,
    autoplay: 3000,
  },
  render: (args) => (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <Carousel {...args}>
        <CarouselContent>
          {sampleSlides.map((slide, i) => (
            <CarouselItem key={i}>
              <Card
                variant="filled"
                style={{
                  height: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: slide.bg,
                }}
              >
                <CardHeader>
                  <CardTitle>
                    Slide {i + 1}: {slide.title}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ margin: 0, color: 'var(--eta-text-muted)' }}>
                    Autoplay active (cycling every 3s). Hover over this card to pause.
                  </p>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselCounter />
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};

export const MultipleItemsPerView: Story = {
  args: {
    itemsPerView: 2,
    loop: false,
  },
  render: (args) => (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1rem' }}>
      <Carousel {...args}>
        <CarouselContent>
          {sampleSlides.concat(sampleSlides).map((slide, i) => (
            <CarouselItem key={i}>
              <Card
                variant="elevated"
                style={{
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: slide.bg,
                }}
              >
                <CardHeader>
                  <CardTitle style={{ fontSize: '1rem' }}>Item #{i + 1}</CardTitle>
                </CardHeader>
                <CardBody>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--eta-text-muted)' }}>
                    {slide.title}
                  </p>
                </CardBody>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    </div>
  ),
};
