/**
 * PelvicFit — Brevo Email Automation Setup
 * 
 * Creates two email sequences:
 * 1. ABANDONED CART (3 emails for quiz leads who didn't buy)
 *    - T+2hr:  "Your results are waiting"
 *    - T+24hr: "The #1 mistake men make with pelvic floor training"
 *    - T+72hr: "Last chance — starter plan for $9.97"
 * 
 * 2. POST-PURCHASE NURTURE (5 emails for paying customers)
 *    - T+1day:  "Day 1 tip — most men skip this"
 *    - T+3days: "Why relaxation matters more than strength"
 *    - T+7days: "Your Week 1 check-in"
 *    - T+14days: "Phase 2 unlocked — introducing The Flick"
 *    - T+21days: "Your transformation + maintenance plan"
 * 
 * Run with: node scripts/setup-email-sequences.js
 * Requires: BREVO_API_KEY in environment
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BASE_URL = 'https://api.brevo.com/v3';

if (!BREVO_API_KEY) {
  console.error('❌ Set BREVO_API_KEY environment variable first');
  process.exit(1);
}

async function brevoFetch(path, body) {
  const resp = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  if (!resp.ok) {
    console.error(`❌ ${path}:`, JSON.stringify(data));
  }
  return { status: resp.status, data };
}

// ─── EMAIL TEMPLATES ─────────────────────────────────────

function emailWrapper(content) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0e2a;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="color:#ffffff;font-size:24px;margin:0;">PelvicFit Men</h1>
    </div>
    <div style="background:#111640;border-radius:16px;padding:32px 24px;border:1px solid #2e3566;">
      ${content}
    </div>
    <div style="text-align:center;margin-top:32px;">
      <p style="color:#6c7a99;font-size:12px;line-height:1.6;">
        Questions? Reply to this email or contact us at<br>
        <a href="mailto:support@pelvicfit.xyz" style="color:#5b8dee;">support@pelvicfit.xyz</a>
      </p>
      <p style="color:#4a5568;font-size:11px;margin-top:16px;">
        © 2026 PelvicFit Men. All rights reserved.<br>
        <a href="https://pelvicfit.xyz/privacy.html" style="color:#4a5568;">Privacy Policy</a> · 
        <a href="https://pelvicfit.xyz/terms.html" style="color:#4a5568;">Terms of Service</a><br>
        <a href="{{ unsubscribe }}" style="color:#4a5568;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── ABANDONED CART EMAILS ───────────────────────────────

const abandonedEmails = [
  {
    name: 'PF_ABANDON_1_results_waiting',
    subject: "Your pelvic floor score: {{ contact.SCORE }}/10 — here's what it means",
    delay: '2 hours',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 8px;">
        Your Results Are Waiting
      </h2>
      <p style="color:#8892b0;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6;">
        You completed our pelvic floor assessment earlier today. Here's what we found.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <div style="font-size:48px;font-weight:800;color:#f59e0b;margin-bottom:4px;">{{ contact.SCORE }}</div>
        <div style="font-size:14px;color:#8892b0;">out of 10 — Current PF Muscle Strength</div>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:16px 0;">
        A score below 6 means your pelvic floor muscles aren't functioning at their potential. But here's the good news: <strong style="color:white;">most men see measurable improvements within 7-14 days</strong> of targeted training.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 12px;">🔬 What the research shows:</p>
        <ul style="color:#c8d0e8;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
          <li>A 2005 clinical trial found 12 weeks of pelvic floor training <strong style="color:white;">improved erectile function in 75% of participants</strong></li>
          <li>The bulbospongiosus muscle — the one that traps blood during erections — responds to targeted training just like any other muscle</li>
          <li>Most men carry chronic tension they can't feel. Phase 1 of training teaches your muscles to fully relax first — then strengthen</li>
        </ul>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:16px 0;">
        Your personalized 28-day protocol is ready. It starts with breathing — not Kegels — because <strong style="color:white;">strengthening a tight muscle just makes it tighter</strong>.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="https://pelvicfit.xyz" style="display:inline-block;background:linear-gradient(135deg,#1abc9c,#2ecc71);color:white;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
          Get My Protocol — $19.97 →
        </a>
      </div>

      <p style="color:#6c7a99;font-size:12px;text-align:center;line-height:1.6;">
        🛡️ 14-day money-back guarantee. No questions asked.
      </p>
    `),
  },

  {
    name: 'PF_ABANDON_2_common_mistakes',
    subject: "The #1 mistake men make with pelvic floor training",
    delay: '24 hours',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 16px;">
        The #1 Mistake That Makes Things Worse
      </h2>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Most men who Google "Kegels for men" start squeezing as hard as they can. <strong style="color:#ef4444;">This is the worst thing you can do.</strong>
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:600;margin:0 0 16px;">Here's why:</p>
        
        <div style="border-left:3px solid #ef4444;padding-left:16px;margin-bottom:16px;">
          <p style="color:#c8d0e8;font-size:13px;line-height:1.7;margin:0;">
            A <strong style="color:white;">"hypertonic" pelvic floor</strong> — muscles stuck in partial contraction — is the hidden cause of many issues. When these muscles can't fully relax, blood flow is impaired. A tight muscle can't trap blood effectively.
          </p>
        </div>

        <div style="border-left:3px solid #2ecc71;padding-left:16px;">
          <p style="color:#c8d0e8;font-size:13px;line-height:1.7;margin:0;">
            <strong style="color:white;">The correct approach:</strong> Learn to fully relax first (Days 1-7), then activate with precision (Days 8-14), then integrate with full-body movements (Days 15-28). This is the protocol used by pelvic floor physiotherapists — not random YouTube Kegels.
          </p>
        </div>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        Your 28-day protocol starts with the <strong style="color:white;">"360-Degree Umbrella Breath"</strong> — a technique that resets your resting muscle tone before any strengthening begins. This single technique is what separates our researched approach from generic advice.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:16px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 8px;">Try this right now (30 seconds):</p>
        <ol style="color:#c8d0e8;font-size:13px;line-height:1.8;margin:0;padding-left:20px;">
          <li>Sit back. Place one hand on your chest, one on your belly.</li>
          <li>Inhale through your nose for 4 seconds — expand your ribs sideways and backward. Your chest hand should barely move.</li>
          <li>Exhale through pursed lips for 6 seconds — like blowing through a straw.</li>
          <li>Notice your pelvic floor. Does it soften on the inhale? That's the foundation.</li>
        </ol>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:16px 0;">
        This one technique is Day 1 of your protocol. There are 27 more days of progressive, guided training waiting for you.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="https://pelvicfit.xyz" style="display:inline-block;background:linear-gradient(135deg,#1abc9c,#2ecc71);color:white;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
          Start My 28-Day Protocol →
        </a>
      </div>

      <p style="color:#6c7a99;font-size:12px;text-align:center;line-height:1.6;">
        🛡️ 14-day money-back guarantee · One-time payment · No subscription
      </p>
    `),
  },

  {
    name: 'PF_ABANDON_3_downsell',
    subject: "We reduced the price for you — $9.97 starter plan",
    delay: '72 hours',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 8px;">
        We Want You to Start — At Any Price
      </h2>
      <p style="color:#8892b0;font-size:14px;text-align:center;margin:0 0 24px;line-height:1.6;">
        We noticed you haven't grabbed your protocol yet. No pressure — but we don't want cost to be the reason.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:24px;margin:24px 0;text-align:center;border:1px solid #3b5bdb;">
        <div style="font-size:12px;color:#5b8dee;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">SPECIAL OFFER — 50% OFF</div>
        <div style="font-size:28px;font-weight:800;color:#ffffff;margin-bottom:4px;">Starter Plan</div>
        <div style="margin:12px 0;">
          <span style="font-size:16px;color:#6c7a99;text-decoration:line-through;">$19.97</span>
          <span style="font-size:32px;font-weight:800;color:#5b8dee;margin-left:8px;">$9.97</span>
        </div>
        <div style="font-size:13px;color:#8892b0;">One-time payment · Instant access</div>
      </div>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 12px;">What's included:</p>
        <div style="color:#c8d0e8;font-size:13px;line-height:2;">
          ✅ 2-Week Foundation Training Plan<br>
          ✅ Daily guided exercises (7 min/day)<br>
          ✅ Progress tracking built in<br>
          ✅ The "Umbrella Breath" relaxation technique<br>
          ✅ The "Flick" activation exercise<br>
          ✅ 14-day money-back guarantee
        </div>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="https://pelvicfit.xyz" style="display:inline-block;background:linear-gradient(135deg,#3b5bdb,#5c35ac);color:white;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
          Get the Starter Plan — $9.97 →
        </a>
      </div>

      <p style="color:#8892b0;font-size:13px;text-align:center;line-height:1.6;margin-top:24px;">
        This is the last email we'll send about pricing.<br>
        We respect your inbox.
      </p>
    `),
  },
];

// ─── POST-PURCHASE NURTURE EMAILS ────────────────────────

const nurtureEmails = [
  {
    name: 'PF_NURTURE_1_day1_tip',
    subject: "Day 1 tip — most men skip this (don't)",
    delay: '1 day',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 16px;">
        🎯 The One Thing to Focus On Today
      </h2>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        You've started your 28-day protocol. Here's the key to making Day 1 count:
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:24px;margin:24px 0;border-left:4px solid #2ecc71;">
        <p style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 8px;">Don't try to "do Kegels" yet.</p>
        <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0;">
          Phase 1 is about <strong style="color:white;">learning to relax</strong>, not squeeze. A tight pelvic floor can't trap blood effectively. Think of it like stretching a rubber band before using it — you need full range of motion first.
        </p>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        <strong style="color:white;">The "Bike Seat Rule":</strong> Most tension is held in the muscles that would touch a bicycle seat — the perineum. You can't feel this tension until you learn to release it. Today's Umbrella Breath is designed exactly for this.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:16px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 8px;">🧪 Quick self-check:</p>
        <p style="color:#c8d0e8;font-size:13px;line-height:1.7;margin:0;">
          Rate your perineal tension right now (0 = completely soft, 10 = rock hard). Write it down. By Day 7, this number should drop 2-4 points. That's the relaxation foundation you're building.
        </p>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="{{ contact.PROTOCOL_URL }}" style="display:inline-block;background:linear-gradient(135deg,#1abc9c,#2ecc71);color:white;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;">
          Open My Day 1 Protocol →
        </a>
      </div>
    `),
  },

  {
    name: 'PF_NURTURE_2_relaxation',
    subject: "Why relaxation matters more than strength",
    delay: '3 days',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 16px;">
        🧘 The Paradox of Pelvic Health
      </h2>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        You're 3 days into your protocol. By now, you should be feeling the first signs of the relaxation phase working — maybe a subtle warmth after the tennis ball release, or the ability to feel the pelvic floor "drop" during breathing.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:15px;font-weight:600;margin:0 0 16px;">Why we don't start with Kegels:</p>
        
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#ef4444;font-size:13px;padding:8px 0;font-weight:600;width:50%;">❌ Generic approach</td>
            <td style="color:#2ecc71;font-size:13px;padding:8px 0;font-weight:600;">✅ PelvicFit approach</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:12px;padding:6px 0;vertical-align:top;">Start squeezing immediately</td>
            <td style="color:#c8d0e8;font-size:12px;padding:6px 0;vertical-align:top;">Reset resting tone first (Days 1-7)</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:12px;padding:6px 0;vertical-align:top;">Max effort from day 1</td>
            <td style="color:#c8d0e8;font-size:12px;padding:6px 0;vertical-align:top;">30-50% effort, build with control</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:12px;padding:6px 0;vertical-align:top;">Squeeze & hold, that's it</td>
            <td style="color:#c8d0e8;font-size:12px;padding:6px 0;vertical-align:top;">Contract + relax ratio (always relax longer)</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:12px;padding:6px 0;vertical-align:top;">Lying down only</td>
            <td style="color:#c8d0e8;font-size:12px;padding:6px 0;vertical-align:top;">Progressive: lying → sitting → standing</td>
          </tr>
        </table>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        <strong style="color:white;">Fun fact:</strong> The "Blossoming" technique you practiced on Day 2 targets the external anal sphincter, which shares fascial connections with the <strong style="color:#f59e0b;">bulbospongiosus</strong> — the muscle directly responsible for blood trapping during erections. When this sphincter learns to release, it creates a cascade of relaxation through the entire pelvic floor.
      </p>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        Keep going. Phase 2 starts on Day 8 — that's when you'll learn "The Flick," the single most important exercise for erectile firmness.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="{{ contact.PROTOCOL_URL }}" style="display:inline-block;background:linear-gradient(135deg,#1abc9c,#2ecc71);color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;">
          Continue My Protocol →
        </a>
      </div>
    `),
  },

  {
    name: 'PF_NURTURE_3_week1_checkin',
    subject: "📊 Week 1 complete — how do you compare?",
    delay: '7 days',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 16px;">
        Week 1: The Results Are In
      </h2>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        You've completed Phase 1 — Foundation & Reset. Let's see where you stand.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 16px;">📈 Typical Day 7 results from our users:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;">Perineal tension</td>
            <td style="color:#2ecc71;font-size:13px;font-weight:600;text-align:right;">↓ 2-4 points</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;">Breath coordination</td>
            <td style="color:#2ecc71;font-size:13px;font-weight:600;text-align:right;">↑ 2-3 points</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;">Body awareness</td>
            <td style="color:#2ecc71;font-size:13px;font-weight:600;text-align:right;">↑ 3-5 points</td>
          </tr>
        </table>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        <strong style="color:#f59e0b;">Phase 2 starts now.</strong> This week, you'll learn <strong style="color:white;">"The Flick"</strong> — a targeted contraction of the bulbospongiosus muscle. This is the muscle that wraps around the base of your penis and compresses the veins to trap blood. A weak bulbospongiosus = blood leaks out faster than it flows in.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:16px;margin:24px 0;border-left:4px solid #f59e0b;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 8px;">The confirmation check:</p>
        <p style="color:#c8d0e8;font-size:13px;line-height:1.7;margin:0;">
          When you do a Flick correctly, your penis should retract slightly (pull toward your body). If your butt lifts off the surface, you're using glutes — not pelvic floor. Keep glutes completely relaxed.
        </p>
      </div>

      <div style="text-align:center;margin:32px 0;">
        <a href="{{ contact.PROTOCOL_URL }}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;">
          Start Phase 2 — Day 8 →
        </a>
      </div>
    `),
  },

  {
    name: 'PF_NURTURE_4_phase2_flick',
    subject: "🏋️ Phase 2 unlocked — meet 'The Flick'",
    delay: '14 days',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 16px;">
        Halfway There — Phase 2 Check-In
      </h2>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Two weeks in. You've trained your pelvic floor to relax AND contract on demand. That's a skill most men never develop.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 12px;">🧪 Day 14 Self-Assessment:</p>
        <p style="color:#c8d0e8;font-size:13px;line-height:1.8;margin:0;">
          Rate yourself on these 4 metrics and compare to Day 1:<br>
          1. Perineal tension (0-10)<br>
          2. Flick isolation quality — can you contract without glutes/abs? (0-10)<br>
          3. Longest endurance hold with perfect form (seconds)<br>
          4. Release speed — how fast can you fully relax after a contraction? (0-10)
        </p>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        <strong style="color:white;">Phase 3 starts now</strong> — this is where it gets exciting. You'll combine pelvic floor activation with full-body movements: Testicular Bridges, Squat + Flick combos, and a 7-minute HIT circuit that's clinically proven to improve vascular health.
      </p>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;">
        <strong style="color:#2ecc71;">Why this matters:</strong> Large leg muscle activation causes a significant increase in systemic Nitric Oxide — the molecule that initiates erections. Combining squats with Flicks gives you both the vascular benefit AND the local strengthening in one protocol.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="{{ contact.PROTOCOL_URL }}" style="display:inline-block;background:linear-gradient(135deg,#1abc9c,#2ecc71);color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;">
          Start Phase 3 →
        </a>
      </div>
    `),
  },

  {
    name: 'PF_NURTURE_5_completion',
    subject: "🏆 28 days complete — your transformation + what's next",
    delay: '21 days',
    content: emailWrapper(`
      <h2 style="color:#ffffff;font-size:20px;text-align:center;margin:0 0 16px;">
        🏆 Protocol Complete — You Did It
      </h2>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        28 days. 4 phases. You've built neuromuscular control from scratch.
      </p>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 12px;">📊 Your Journey:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;font-weight:600;">Phase 1</td>
            <td style="color:#2ecc71;font-size:13px;padding:8px 0;">Foundation & Reset ✅</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;font-weight:600;">Phase 2</td>
            <td style="color:#2ecc71;font-size:13px;padding:8px 0;">Activation — The Flick ✅</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;font-weight:600;">Phase 3</td>
            <td style="color:#2ecc71;font-size:13px;padding:8px 0;">Integration — Full Body ✅</td>
          </tr>
          <tr>
            <td style="color:#8892b0;font-size:13px;padding:8px 0;font-weight:600;">Phase 4</td>
            <td style="color:#2ecc71;font-size:13px;padding:8px 0;">Mastery & Application ✅</td>
          </tr>
        </table>
      </div>

      <div style="background:#0a0e2a;border-radius:12px;padding:20px;margin:24px 0;border-left:4px solid #2ecc71;">
        <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 8px;">Your Maintenance Protocol:</p>
        <p style="color:#c8d0e8;font-size:13px;line-height:1.7;margin:0;">
          To maintain your gains long-term, do the <strong style="color:white;">Day 20 Full Integration Circuit</strong> 3x per week. That's 15 minutes, three times a week. Research shows gains are maintained with this frequency.
        </p>
      </div>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;margin:20px 0;">
        <strong style="color:#f59e0b;">Pro tip:</strong> Habits compound. The men who see the best long-term results are the ones who keep the 5-Position Relaxation Flow (Day 5) as a daily practice — even just 5 minutes. Relaxation is the foundation everything else is built on.
      </p>

      <p style="color:#c8d0e8;font-size:14px;line-height:1.7;">
        Your dashboard is always available. Bookmark it and return whenever you need a session.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="{{ contact.PROTOCOL_URL }}" style="display:inline-block;background:linear-gradient(135deg,#1abc9c,#2ecc71);color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:15px;">
          Open My Dashboard →
        </a>
      </div>

      <p style="color:#8892b0;font-size:13px;text-align:center;line-height:1.6;margin-top:24px;">
        Questions or feedback? We'd love to hear from you.<br>
        Reply to this email or reach us at <a href="mailto:support@pelvicfit.xyz" style="color:#5b8dee;">support@pelvicfit.xyz</a>
      </p>
    `),
  },
];

// ─── SETUP FUNCTIONS ─────────────────────────────────────

async function createEmailTemplate(email) {
  console.log(`📧 Creating template: ${email.name}...`);
  const result = await brevoFetch('/smtp/templates', {
    sender: { name: 'PelvicFit Men', email: 'support@pelvicfit.xyz' },
    templateName: email.name,
    subject: email.subject,
    htmlContent: email.content,
    isActive: true,
  });
  
  if (result.status === 201 || result.status === 200) {
    console.log(`  ✅ Created: ${email.name} (ID: ${result.data.id})`);
    return result.data.id;
  } else {
    console.error(`  ❌ Failed to create: ${email.name}`);
    return null;
  }
}

async function main() {
  console.log('🚀 PelvicFit Email Sequence Setup\n');
  console.log('━'.repeat(50));

  // Create abandoned cart templates
  console.log('\n📮 ABANDONED CART SEQUENCE (Quiz Leads — List 4)');
  console.log('━'.repeat(50));
  const abandonedIds = [];
  for (const email of abandonedEmails) {
    const id = await createEmailTemplate(email);
    abandonedIds.push({ name: email.name, id, delay: email.delay });
  }

  // Create nurture templates
  console.log('\n📮 POST-PURCHASE NURTURE SEQUENCE (Customers — List 5)');
  console.log('━'.repeat(50));
  const nurtureIds = [];
  for (const email of nurtureEmails) {
    const id = await createEmailTemplate(email);
    nurtureIds.push({ name: email.name, id, delay: email.delay });
  }

  // Summary
  console.log('\n\n' + '━'.repeat(50));
  console.log('📋 SETUP COMPLETE — Template IDs:');
  console.log('━'.repeat(50));
  
  console.log('\nAbandoned Cart Emails:');
  abandonedIds.forEach(e => console.log(`  ${e.delay.padEnd(10)} → ${e.name} (ID: ${e.id})`));
  
  console.log('\nPost-Purchase Nurture Emails:');
  nurtureIds.forEach(e => console.log(`  ${e.delay.padEnd(10)} → ${e.name} (ID: ${e.id})`));

  console.log('\n' + '━'.repeat(50));
  console.log('📌 NEXT STEPS — Set up automations in Brevo UI:');
  console.log('━'.repeat(50));
  console.log(`
Automation 1: ABANDONED CART
  Trigger: Contact added to List 4
  Flow:
    → Wait 2 hours
    → Check: STATUS ≠ "customer"
      → YES: Send "${abandonedIds[0]?.name}"
      → Wait 22 hours
      → Check: STATUS ≠ "customer"
        → YES: Send "${abandonedIds[1]?.name}"
        → Wait 48 hours
        → Check: STATUS ≠ "customer"
          → YES: Send "${abandonedIds[2]?.name}"

Automation 2: POST-PURCHASE NURTURE
  Trigger: Contact added to List 5
  Flow:
    → Wait 1 day  → Send "${nurtureIds[0]?.name}"
    → Wait 2 days → Send "${nurtureIds[1]?.name}"
    → Wait 4 days → Send "${nurtureIds[2]?.name}"
    → Wait 7 days → Send "${nurtureIds[3]?.name}"
    → Wait 7 days → Send "${nurtureIds[4]?.name}"
`);
}

main().catch(console.error);
