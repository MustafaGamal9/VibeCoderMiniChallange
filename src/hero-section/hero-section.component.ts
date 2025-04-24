import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Local storage keys
const HEADLINES_STORAGE_KEY = 'heroSectionHeadlines_v1';
const SUBHEADLINES_STORAGE_KEY = 'heroSectionSubheadlines_v1';
const LAST_INDEX_STORAGE_KEY = 'heroSectionLastIndex_v1'; // Changed from currentIndex

// Component definition
@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent implements OnInit {

  // Template-bound properties - These are ONLY set by setContentsByIndex now
  headline!: string;
  subheadline!: string;
  imageUrl!: string;

  // Default content data
  private defaultHeadlines: string[] = [
    'The Future of Education is Here',
    'Interactive Learning, Anywhere, Anytime',
    'Studying Online is now much easier',
    'Master New Skills with Ease'
  ];
  private defaultSubheadlines: string[] = [
    'An innovative platform that teaches you in a more interactive way',
    'Engage with cutting-edge tools and a vibrant community.',
    'Join thousands of learners achieving their goals with us.',
    'Personalized learning paths designed for your success.'
  ];
  private defaultInitialIndex = 2;

  // Working content arrays
  private headlines!: string[];
  private subheadlines!: string[];

  // Image assets
  private baseImageUrls: string[] = [
    'hero-home.svg',
    'Discovery.svg',
    'Student-stress.svg',
    'Students-amico.svg'
  ];

  // Current state - Using 'currentIndex' to represent the *displayed* item's index
  private currentIndex: number = -1;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.loadContent(); // This sets the initial currentIndex
    // Set initial display based on loaded/default index
    this.setContentsByIndex(this.currentIndex);
  }

  private loadContent(): void {
    let loadedIndex = this.defaultInitialIndex; // Start with default initial

    if (isPlatformBrowser(this.platformId)) {
      try {
        // Load headlines
        const storedHeadlines = localStorage.getItem(HEADLINES_STORAGE_KEY);
        this.headlines = storedHeadlines ? JSON.parse(storedHeadlines) : [...this.defaultHeadlines];
        // Basic validation
        if (!Array.isArray(this.headlines) || this.headlines.length !== this.defaultHeadlines.length) {
            console.warn("Stored headlines data invalid, using defaults.");
            this.headlines = [...this.defaultHeadlines];
        }

        // Load subheadlines
        const storedSubheadlines = localStorage.getItem(SUBHEADLINES_STORAGE_KEY);
        this.subheadlines = storedSubheadlines ? JSON.parse(storedSubheadlines) : [...this.defaultSubheadlines];
         // Basic validation
        if (!Array.isArray(this.subheadlines) || this.subheadlines.length !== this.defaultSubheadlines.length) {
             console.warn("Stored subheadlines data invalid, using defaults.");
             this.subheadlines = [...this.defaultSubheadlines];
        }

        // Load last index
        const storedIndex = localStorage.getItem(LAST_INDEX_STORAGE_KEY);
        if (storedIndex) {
          const parsedIndex = parseInt(storedIndex, 10);
          if (!isNaN(parsedIndex) && parsedIndex >= 0 && parsedIndex < this.headlines.length) {
            loadedIndex = parsedIndex; // Use stored index if valid
          } else {
             console.warn("Stored index invalid, using default initial index.");
          }
        }
        // If no stored index, loadedIndex remains defaultInitialIndex

      } catch (error) {
        console.error("Error loading content from localStorage, using defaults:", error);
        this.headlines = [...this.defaultHeadlines];
        this.subheadlines = [...this.defaultSubheadlines];
        loadedIndex = this.defaultInitialIndex; // Fallback to default initial index on error
      }
    } else { // SSR
      this.headlines = [...this.defaultHeadlines];
      this.subheadlines = [...this.defaultSubheadlines];
      loadedIndex = this.defaultInitialIndex;
    }

    // Set the component's currentIndex based on what was loaded or defaulted
    this.currentIndex = loadedIndex;
  }

  // Content saving logic - saves arrays and current index
  private saveContent(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(HEADLINES_STORAGE_KEY, JSON.stringify(this.headlines));
        localStorage.setItem(SUBHEADLINES_STORAGE_KEY, JSON.stringify(this.subheadlines));
        // Save the index of the item currently being displayed
        localStorage.setItem(LAST_INDEX_STORAGE_KEY, this.currentIndex.toString());
      } catch (error) {
        console.error("Error saving content to localStorage:", error);
      }
    }
  }

  // Updates the template-bound properties ONLY
  private setContentsByIndex(index: number): void {
    const numItems = this.headlines?.length || 0;
     // More robust check to ensure arrays are loaded and index is valid
    if (!this.headlines || !this.subheadlines || numItems === 0 || index < 0 || index >= numItems) {
        console.error(`Attempted to set content with invalid index (${index}) or content arrays not ready.`);
         // Attempt to recover or set a default state if possible
        if (this.headlines?.length) { // If arrays exist, maybe just index was bad?
             console.warn(`Falling back to default initial index: ${this.defaultInitialIndex}`);
             index = this.defaultInitialIndex;
             this.currentIndex = index; // Correct the state
        } else {
             console.error("Content arrays are missing. Cannot set content.");
             // Potentially load defaults here if absolutely necessary, but indicates a logic flaw earlier
             this.loadContent(); // Try loading again? Risky.
             return; // Exit if truly unrecoverable
        }
    }

    // Set template-bound properties from the WORKING arrays
    this.headline = this.headlines[index];
    this.subheadline = this.subheadlines[index];

    // Update image (with cache-busting)
    const baseImageUrl = this.baseImageUrls[index];
    const timestamp = new Date().getTime();
    this.imageUrl = `${baseImageUrl}?v=${timestamp}`;
  }

  // Content regeneration
  regenerateContent(): void {
    const numItems = this.headlines.length;
    if (numItems <= 1) {
      if(numItems === 1) this.setContentsByIndex(0);
      return;
    }

    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * numItems);
    } while (randomIndex === this.currentIndex); // Ensure it's different from current

    // Update the state
    this.currentIndex = randomIndex;
    // Update the display
    this.setContentsByIndex(this.currentIndex);
    // Save the new state (including the new index)
    this.saveContent();
  }

  // Headline update from input event
  updateHeadline(event: Event): void {
    const element = event.target as HTMLElement;
    const newText = element.textContent || '';
    // --- DO NOT update this.headline here ---
    // this.headline = newText; // REMOVED

    // Update the source array only
    if (this.currentIndex >= 0 && this.currentIndex < this.headlines.length) {
       this.headlines[this.currentIndex] = newText;
       // Save arrays and the CURRENT index
       this.saveContent();
    } else {
        console.warn("Cannot save headline edit, currentIndex is invalid:", this.currentIndex);
    }
  }

  // Subheadline update from input event
  updateSubheadline(event: Event): void {
    const element = event.target as HTMLElement;
    const newText = element.textContent || '';
    // --- DO NOT update this.subheadline here ---
    // this.subheadline = newText; // REMOVED

    // Update the source array only
    if (this.currentIndex >= 0 && this.currentIndex < this.subheadlines.length) {
        this.subheadlines[this.currentIndex] = newText;
        // Save arrays and the CURRENT index
        this.saveContent();
    } else {
         console.warn("Cannot save subheadline edit, currentIndex is invalid:", this.currentIndex);
    }
  }
}