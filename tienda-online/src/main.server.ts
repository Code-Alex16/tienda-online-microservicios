// Assuming this is for Angular Universal SSR, also needs the component path corrected
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // Corrected import path for AppComponent
import { config } from './app/app.config.server'; // Assuming app.config.server.ts exists

const bootstrap = () => bootstrapApplication(AppComponent, config); // Use AppComponent

export default bootstrap;