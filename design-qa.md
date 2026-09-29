# Beyond Limits visual and interaction QA

Source visual target: production/revision-2/option-2.png (1536×1024). Owner approved this direction; content migration and a controlled page animation were the requested extensions.

Implementation captures: production/qa/desktop-opening.png, desktop-reading.png, desktop-turned.png, desktop-program.png; mobile-reading.png, mobile-menu.png, mobile-tutoring.png, mobile-voices.png, mobile-reduced.png.

Viewports: desktop 1536×1024 CSS pixels and 1× capture density, directly comparable to the 1536×1024 source; mobile 390×844 at 1×. Additional in-app visual inspection at 1280×720 and 390×844. Source, desktop read state and mobile capture were opened together for visual comparison. Focused book/typography inspection used full-resolution captures, not a claim of pixel-identical reproduction.

Comparison history:
- Fixed initial reduced-motion zero-length progress division, which caused invalid opacity and a missing page. Fresh test browser has zero errors.
- Enlarged page lettering after mobile/desktop visual inspection.
- Corrected the mobile sky's hard boundary with a reading-safe blended upper region.
- Fixed visible texture-triangle seams with overlap and an underlying paper surface.
- Corrected front/back page rendering: print is shown on the front, blank reverse after the edge-on transition; curved final state follows the left book surface.
- Replaced the generated approximation of the company mark with its actual original logo. Its vertical format differs from the generated horizontal mockup; factual brand fidelity takes precedence over malformed generated lettering.
- Added direct participant and tutor form destinations, kept documents local, labeled dated program resources, and verified native menu anchors.

Functional results: production/qa/checks.json. No page/console errors in fresh browser. No horizontal mobile overflow, broken loaded images, missing anchors or old marketing-site links. All 11 document URLs returned success. Forward animation changes the rendered canvas; reverse scroll restores the identical starting scene. Mobile menu routes, testimonial next/previous states, and reduced-motion persistence passed. Production build passed.

Intentional implementation differences: native Outfit typography replaces approximate generated lettering; one short original page quote replaces gibberish. Header settles continuously; the canvas is scroll-controlled instead of playing the rejected generated video. Mobile moves copy above the principal book area and adds a readable HTML quote equivalent. Later program content follows the requested complete content migration, rather than a hero-only mockup.

Remaining production integration: automated mailing-list subscription needs the organization's mailing provider connection. A clearly labeled email request and local newsletter download work now. No fake success UI. This is not a visual defect but prevents claiming a production newsletter backend is connected.

Residual test limits: simulated mobile viewport, not a physical iOS/Android device; external form submission and payment were deliberately not executed. The book motion is an art-directed mesh animation, not a validated physics simulation. No public deployment was performed.

final result: passed
