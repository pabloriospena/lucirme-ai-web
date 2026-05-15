/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    clerk: any; // Aquí le decimos a TS que "clerk" existe
    auth: any;  // Y aquí "auth"
  }
}