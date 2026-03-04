import { describe, it, expect, beforeEach, vi } from 'vitest'

import { setUIConfig, getUIConfig, resetUIConfig } from './ui-config'

describe('ui-config', () => {
  beforeEach(() => {
    resetUIConfig()
  })

  it('throws error when config not initialized', () => {
    expect(() => getUIConfig()).toThrow('UIConfig not initialized')
  })

  it('returns config after initialization', () => {
    const mockLink = vi.fn(() => null)

    setUIConfig({
      baseDomain: 'https://test.com',
      Link: mockLink,
    })

    const config = getUIConfig()
    expect(config.baseDomain).toBe('https://test.com')
    expect(config.Link).toBe(mockLink)
  })

  it('returns same config instance on multiple calls (cache)', () => {
    const mockLink = vi.fn(() => null)

    setUIConfig({
      baseDomain: 'https://test.com',
      Link: mockLink,
    })

    const config1 = getUIConfig()
    const config2 = getUIConfig()

    expect(config1).toBe(config2) // Same reference
  })

  it('warns on duplicate initialization', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const mockLink = vi.fn(() => null)

    setUIConfig({ baseDomain: 'https://test.com', Link: mockLink })
    setUIConfig({ baseDomain: 'https://other.com', Link: mockLink })

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('already initialized'),
    )

    consoleSpy.mockRestore()
  })
})
