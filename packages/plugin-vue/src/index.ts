import type { Plugin } from '@svge/core'

export const vuePlugin: Plugin = (code) => {
  return `<template>${code}</template>`
}
