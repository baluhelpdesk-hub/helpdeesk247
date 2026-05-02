import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // ── BARBELL COMPOUND ──────────────────────────────────────────────────────
  {
    slug: "barbell-squat",
    name: "Barbell Back Squat",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "erectors", "core"],
    equipment: ["barbell", "rack"],
    difficulty: "intermediate",
    instructions: [
      "Set the bar on the rack at upper-chest height. Step under it, bar resting on your traps.",
      "Stand with feet shoulder-width apart, toes slightly out.",
      "Unrack and step back. Brace your core and take a deep breath.",
      "Descend by pushing knees out in line with toes. Aim for thighs parallel or below.",
      "Drive through your heels to stand, keeping chest tall throughout.",
    ],
    commonMistakes: ["Knees caving inward", "Rounding the lower back", "Rising on toes", "Leaning too far forward"],
  },
  {
    slug: "barbell-deadlift",
    name: "Conventional Deadlift",
    primaryMuscles: ["hamstrings", "glutes", "erectors"],
    secondaryMuscles: ["quadriceps", "traps", "forearms", "core"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot.",
      "Hinge at the hips and grip the bar just outside your legs.",
      "Straighten your back, chest up, hips above knees.",
      "Push the floor away. Keep the bar dragging up your shins.",
      "Lock out hips and knees at the top, then lower with control.",
    ],
    commonMistakes: ["Rounding the lower back", "Bar drifting forward", "Jerking the bar off the floor", "Hyperextending at lockout"],
  },
  {
    slug: "barbell-bench-press",
    name: "Barbell Bench Press",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "anterior deltoid"],
    equipment: ["barbell", "bench", "rack"],
    difficulty: "intermediate",
    instructions: [
      "Lie on the bench with eyes under the bar. Plant feet flat.",
      "Grip the bar slightly wider than shoulder-width.",
      "Unrack, lower the bar to lower chest with elbows at ~75°.",
      "Press back up in a slight arc to the starting position.",
    ],
    commonMistakes: ["Flaring elbows out too wide", "Bouncing off the chest", "Lifting the hips off the bench"],
  },
  {
    slug: "barbell-overhead-press",
    name: "Barbell Overhead Press",
    primaryMuscles: ["anterior deltoid", "medial deltoid"],
    secondaryMuscles: ["triceps", "upper traps", "core"],
    equipment: ["barbell", "rack"],
    difficulty: "intermediate",
    instructions: [
      "Hold the bar at shoulder level, grip just outside shoulder-width.",
      "Brace your core and glutes.",
      "Press the bar overhead in a straight path, tucking chin out of the way.",
      "Lock out fully, ears between arms at the top.",
      "Lower under control back to shoulders.",
    ],
    commonMistakes: ["Excessive lumbar extension", "Pressing in front of face instead of straight up", "Not locking out"],
  },
  {
    slug: "barbell-row",
    name: "Barbell Bent-Over Row",
    primaryMuscles: ["lats", "rhomboids", "mid traps"],
    secondaryMuscles: ["biceps", "rear deltoid", "erectors"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Hinge forward ~45°, back flat, bar hanging at arm's length.",
      "Pull the bar to your lower chest, leading with elbows.",
      "Squeeze shoulder blades at the top.",
      "Lower with control.",
    ],
    commonMistakes: ["Jerking with the lower back", "Using too much momentum", "Pulling to the stomach instead of chest"],
  },
  {
    slug: "barbell-rdl",
    name: "Romanian Deadlift",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["erectors", "core"],
    equipment: ["barbell"],
    difficulty: "beginner",
    instructions: [
      "Hold the bar at hip level. Soft bend in knees.",
      "Push hips back, keeping the bar close to your legs.",
      "Lower until you feel a stretch in the hamstrings (typically mid-shin).",
      "Drive hips forward to return to standing.",
    ],
    commonMistakes: ["Rounding the back", "Bending knees too much", "Letting the bar drift forward"],
  },
  {
    slug: "barbell-hip-thrust",
    name: "Barbell Hip Thrust",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: ["barbell", "bench"],
    difficulty: "intermediate",
    instructions: [
      "Sit on the floor with upper back against a bench. Bar over hips.",
      "Plant feet hip-width, bend knees to ~90°.",
      "Drive through heels, extend hips fully at the top.",
      "Squeeze glutes hard at peak, then lower under control.",
    ],
    commonMistakes: ["Not fully extending at the top", "Bar slipping forward", "Overarching lower back"],
  },
  // ── DUMBBELL ──────────────────────────────────────────────────────────────
  {
    slug: "db-goblet-squat",
    name: "Goblet Squat",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core", "upper back"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Hold one dumbbell vertically at chest height.",
      "Feet shoulder-width, toes slightly out.",
      "Squat deep while keeping the dumbbell close to your chest.",
      "Drive up through heels.",
    ],
    commonMistakes: ["Letting the torso collapse forward", "Knees caving in"],
  },
  {
    slug: "db-lunge",
    name: "Dumbbell Lunge",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Hold dumbbells at sides. Step one foot forward.",
      "Lower back knee toward the floor, keeping front knee over ankle.",
      "Push through front heel to return. Alternate legs.",
    ],
    commonMistakes: ["Front knee tracking past toes", "Leaning too far forward"],
  },
  {
    slug: "db-incline-press",
    name: "Dumbbell Incline Press",
    primaryMuscles: ["upper chest"],
    secondaryMuscles: ["triceps", "anterior deltoid"],
    equipment: ["dumbbells", "bench"],
    difficulty: "beginner",
    instructions: [
      "Set bench to 30-45°. Sit with dumbbells on thighs.",
      "Kick them up and press to the start position.",
      "Lower to chest level, elbows at ~75°.",
      "Press back up and extend fully.",
    ],
    commonMistakes: ["Flaring elbows out completely", "Touching dumbbells at the top too forcefully"],
  },
  {
    slug: "db-shoulder-press",
    name: "Dumbbell Shoulder Press",
    primaryMuscles: ["anterior deltoid", "medial deltoid"],
    secondaryMuscles: ["triceps", "upper traps"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Sit or stand. Hold dumbbells at shoulder height, palms forward.",
      "Press overhead until arms are extended.",
      "Lower to start with control.",
    ],
    commonMistakes: ["Arching lower back excessively", "Not reaching full lockout"],
  },
  {
    slug: "db-lateral-raise",
    name: "Dumbbell Lateral Raise",
    primaryMuscles: ["medial deltoid"],
    secondaryMuscles: ["anterior deltoid", "traps"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand holding dumbbells at sides, slight bend in elbows.",
      "Raise arms to the sides until parallel to floor.",
      "Pinky slightly higher than thumb (pour a jug of water).",
      "Lower slowly.",
    ],
    commonMistakes: ["Using momentum", "Shrugging at the top", "Going above parallel"],
  },
  {
    slug: "db-curl",
    name: "Dumbbell Bicep Curl",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["brachialis", "forearms"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand holding dumbbells at sides, palms forward.",
      "Curl toward shoulders, keeping elbows pinned to ribs.",
      "Squeeze at the top. Lower slowly.",
    ],
    commonMistakes: ["Swinging the body", "Letting elbows drift forward"],
  },
  {
    slug: "db-row",
    name: "Dumbbell Row",
    primaryMuscles: ["lats", "rhomboids"],
    secondaryMuscles: ["biceps", "rear deltoid"],
    equipment: ["dumbbells", "bench"],
    difficulty: "beginner",
    instructions: [
      "Place one knee and same-side hand on bench. Hold dumbbell in other hand.",
      "Pull dumbbell toward hip, elbow close to body.",
      "Lower with control.",
    ],
    commonMistakes: ["Rotating the torso", "Pulling to the shoulder instead of hip"],
  },
  {
    slug: "db-rdl",
    name: "Dumbbell Romanian Deadlift",
    primaryMuscles: ["hamstrings", "glutes"],
    secondaryMuscles: ["erectors"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Hold dumbbells in front of thighs. Soft knee bend.",
      "Hinge at hips, lowering dumbbells along legs.",
      "Feel hamstring stretch, then drive hips forward to stand.",
    ],
    commonMistakes: ["Rounding the back", "Squatting instead of hinging"],
  },
  {
    slug: "db-chest-fly",
    name: "Dumbbell Chest Fly",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["anterior deltoid"],
    equipment: ["dumbbells", "bench"],
    difficulty: "beginner",
    instructions: [
      "Lie flat, dumbbells extended above chest, slight elbow bend.",
      "Lower dumbbells in a wide arc until chest level.",
      "Bring back up as if hugging a tree.",
    ],
    commonMistakes: ["Going too heavy", "Straightening elbows fully", "Dropping too low"],
  },
  {
    slug: "db-tricep-extension",
    name: "Dumbbell Overhead Tricep Extension",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Hold one dumbbell overhead with both hands.",
      "Lower behind head by bending elbows.",
      "Extend back up to start.",
    ],
    commonMistakes: ["Elbows flaring outward", "Using momentum"],
  },
  {
    slug: "db-reverse-lunge",
    name: "Dumbbell Reverse Lunge",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand holding dumbbells at sides.",
      "Step one foot back and lower knee toward the floor.",
      "Push through front foot to return. Alternate.",
    ],
    commonMistakes: ["Leaning forward excessively", "Front heel lifting"],
  },
  {
    slug: "db-step-up",
    name: "Dumbbell Step-Up",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Hold dumbbells at sides. Stand facing a bench or box.",
      "Step one foot up, drive through that heel to stand on the box.",
      "Step back down. Alternate legs.",
    ],
    commonMistakes: ["Pushing off the rear foot", "Leaning too far forward"],
  },
  {
    slug: "db-arnold-press",
    name: "Arnold Press",
    primaryMuscles: ["anterior deltoid", "medial deltoid"],
    secondaryMuscles: ["triceps", "posterior deltoid"],
    equipment: ["dumbbells"],
    difficulty: "intermediate",
    instructions: [
      "Sit with dumbbells at chest, palms facing you.",
      "Rotate palms outward as you press overhead.",
      "Reverse rotation on the way down.",
    ],
    commonMistakes: ["Rushing the rotation", "Arching lower back"],
  },
  {
    slug: "db-hammer-curl",
    name: "Hammer Curl",
    primaryMuscles: ["brachialis", "biceps"],
    secondaryMuscles: ["forearms"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Hold dumbbells at sides, neutral grip (palms in).",
      "Curl toward shoulders without rotating wrists.",
      "Lower slowly.",
    ],
    commonMistakes: ["Swinging the torso", "Flaring elbows out"],
  },
  // ── CABLE ─────────────────────────────────────────────────────────────────
  {
    slug: "cable-lat-pulldown",
    name: "Lat Pulldown",
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "rhomboids", "rear deltoid"],
    equipment: ["cable_machine"],
    difficulty: "beginner",
    instructions: [
      "Grip the bar wider than shoulder-width, palms forward.",
      "Lean back slightly, pull bar to upper chest.",
      "Squeeze lats at the bottom. Return slowly.",
    ],
    commonMistakes: ["Pulling behind the neck", "Leaning too far back", "Using momentum"],
  },
  {
    slug: "cable-row",
    name: "Seated Cable Row",
    primaryMuscles: ["lats", "mid traps", "rhomboids"],
    secondaryMuscles: ["biceps", "rear deltoid"],
    equipment: ["cable_machine"],
    difficulty: "beginner",
    instructions: [
      "Sit with knees slightly bent, grip handle at arm's length.",
      "Pull handle to your abdomen, driving elbows back.",
      "Squeeze shoulder blades. Extend arms slowly.",
    ],
    commonMistakes: ["Rounding the back", "Leaning back to use momentum"],
  },
  {
    slug: "cable-tricep-pushdown",
    name: "Cable Tricep Pushdown",
    primaryMuscles: ["triceps"],
    secondaryMuscles: [],
    equipment: ["cable_machine"],
    difficulty: "beginner",
    instructions: [
      "Stand facing cable, high pulley, rope or bar attachment.",
      "Elbows pinned to sides. Push down to full extension.",
      "Return slowly, keeping elbows still.",
    ],
    commonMistakes: ["Elbows flaring out", "Leaning forward too much"],
  },
  {
    slug: "cable-face-pull",
    name: "Cable Face Pull",
    primaryMuscles: ["rear deltoid", "external rotators"],
    secondaryMuscles: ["mid traps", "rhomboids"],
    equipment: ["cable_machine"],
    difficulty: "beginner",
    instructions: [
      "Set cable at face height, use rope attachment.",
      "Pull rope to face, separating hands at the end.",
      "External rotate — thumbs behind ears at finish.",
    ],
    commonMistakes: ["Pulling to the neck instead of face", "Not externally rotating at the end"],
  },
  {
    slug: "cable-curl",
    name: "Cable Bicep Curl",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["brachialis"],
    equipment: ["cable_machine"],
    difficulty: "beginner",
    instructions: [
      "Low pulley, straight bar or EZ bar.",
      "Curl toward shoulders, elbows pinned to sides.",
      "Lower under constant tension.",
    ],
    commonMistakes: ["Swinging the body", "Elbows drifting forward"],
  },
  {
    slug: "cable-crunch",
    name: "Cable Crunch",
    primaryMuscles: ["rectus abdominis"],
    secondaryMuscles: ["obliques"],
    equipment: ["cable_machine"],
    difficulty: "beginner",
    instructions: [
      "Kneel facing cable, high pulley with rope.",
      "Hold rope at head level. Round forward, pulling elbows toward knees.",
      "Contract abs at the bottom. Return slowly.",
    ],
    commonMistakes: ["Using hip flexors instead of abs", "Pulling with the arms"],
  },
  // ── BODYWEIGHT ────────────────────────────────────────────────────────────
  {
    slug: "push-up",
    name: "Push-Up",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "anterior deltoid", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start in plank: hands slightly wider than shoulders.",
      "Lower chest to floor, elbows at ~45°.",
      "Push back up to full arm extension.",
    ],
    commonMistakes: ["Sagging hips", "Flaring elbows out fully", "Not reaching full depth"],
  },
  {
    slug: "pull-up",
    name: "Pull-Up",
    primaryMuscles: ["lats"],
    secondaryMuscles: ["biceps", "rhomboids", "rear deltoid"],
    equipment: ["pull_up_bar"],
    difficulty: "intermediate",
    instructions: [
      "Hang from bar, overhand grip, shoulder-width.",
      "Pull yourself up until chin clears the bar.",
      "Lower with full control to dead hang.",
    ],
    commonMistakes: ["Kipping without strength base", "Not reaching full arm extension at bottom"],
  },
  {
    slug: "chin-up",
    name: "Chin-Up",
    primaryMuscles: ["lats", "biceps"],
    secondaryMuscles: ["rhomboids", "rear deltoid"],
    equipment: ["pull_up_bar"],
    difficulty: "intermediate",
    instructions: [
      "Hang from bar, underhand grip, shoulder-width.",
      "Pull until chin clears bar, elbows driving down.",
      "Lower to full arm extension.",
    ],
    commonMistakes: ["Swinging", "Incomplete range of motion"],
  },
  {
    slug: "dip",
    name: "Tricep Dip",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "anterior deltoid"],
    equipment: ["dip_bars"],
    difficulty: "intermediate",
    instructions: [
      "Grip parallel bars, arms extended. Slight forward lean.",
      "Lower by bending elbows to ~90°.",
      "Press back up to full extension.",
    ],
    commonMistakes: ["Going too low with weak shoulder mobility", "Flaring elbows out"],
  },
  {
    slug: "bodyweight-squat",
    name: "Bodyweight Squat",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Feet shoulder-width, toes slightly out.",
      "Descend, pushing knees out, arms forward for balance.",
      "Drive up through heels.",
    ],
    commonMistakes: ["Knees caving in", "Heels lifting off floor"],
  },
  {
    slug: "glute-bridge",
    name: "Glute Bridge",
    primaryMuscles: ["glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Lie on back, knees bent, feet flat.",
      "Drive hips up, squeezing glutes at the top.",
      "Hold 1 second, lower with control.",
    ],
    commonMistakes: ["Overextending lower back", "Feet too far or too close"],
  },
  {
    slug: "plank",
    name: "Plank",
    primaryMuscles: ["core"],
    secondaryMuscles: ["anterior deltoid", "glutes"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Forearms on floor, elbows under shoulders.",
      "Body in a straight line from head to heels.",
      "Brace core and hold.",
    ],
    commonMistakes: ["Hips too high or too low", "Holding breath"],
  },
  {
    slug: "mountain-climber",
    name: "Mountain Climber",
    primaryMuscles: ["core"],
    secondaryMuscles: ["hip flexors", "chest", "shoulders"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start in high plank position.",
      "Drive one knee toward chest, then quickly switch.",
      "Maintain flat back throughout.",
    ],
    commonMistakes: ["Hips rising and falling", "Losing shoulder stability"],
  },
  {
    slug: "burpee",
    name: "Burpee",
    primaryMuscles: ["full body"],
    secondaryMuscles: [],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Stand, squat down, place hands on floor.",
      "Jump or step feet back into plank.",
      "Perform a push-up. Jump feet back to hands.",
      "Jump up and clap overhead.",
    ],
    commonMistakes: ["Sagging hips in plank", "Skipping the push-up"],
  },
  {
    slug: "reverse-crunch",
    name: "Reverse Crunch",
    primaryMuscles: ["rectus abdominis"],
    secondaryMuscles: ["hip flexors"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Lie on back, knees bent, hands at sides.",
      "Curl knees toward chest, lifting hips off floor.",
      "Lower slowly without letting lower back arch.",
    ],
    commonMistakes: ["Using momentum", "Dropping hips too fast"],
  },
  {
    slug: "superman-hold",
    name: "Superman Hold",
    primaryMuscles: ["erectors"],
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Lie face down, arms extended overhead.",
      "Lift arms and legs simultaneously.",
      "Hold at the top, then lower.",
    ],
    commonMistakes: ["Only lifting the upper or lower body", "Straining the neck"],
  },
  {
    slug: "hip-abduction",
    name: "Lying Hip Abduction",
    primaryMuscles: ["glutes", "hip abductors"],
    secondaryMuscles: [],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Lie on side, legs stacked.",
      "Raise top leg to about 45°.",
      "Lower slowly. Keep hips stacked.",
    ],
    commonMistakes: ["Rolling hips back", "Using momentum"],
  },
  {
    slug: "tricep-dip-bench",
    name: "Bench Tricep Dip",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["chest", "anterior deltoid"],
    equipment: ["bench", "bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Place hands on bench edge, fingers forward. Feet on floor.",
      "Lower body by bending elbows to 90°.",
      "Press back up to full extension.",
    ],
    commonMistakes: ["Elbows flaring out", "Feet too far from bench"],
  },
  // ── MACHINE ───────────────────────────────────────────────────────────────
  {
    slug: "leg-press",
    name: "Leg Press",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings"],
    equipment: ["leg_press_machine"],
    difficulty: "beginner",
    instructions: [
      "Sit in machine, feet shoulder-width on platform.",
      "Unlock and lower sled until knees reach ~90°.",
      "Press through heels to full extension. Don't lock out aggressively.",
    ],
    commonMistakes: ["Knees caving in", "Letting lower back round off the pad"],
  },
  {
    slug: "leg-curl",
    name: "Seated Leg Curl",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["gastrocnemius"],
    equipment: ["leg_curl_machine"],
    difficulty: "beginner",
    instructions: [
      "Sit in machine, pad over lower shin.",
      "Curl legs down as far as possible.",
      "Return slowly.",
    ],
    commonMistakes: ["Hips lifting off seat", "Using momentum"],
  },
  {
    slug: "leg-extension",
    name: "Leg Extension",
    primaryMuscles: ["quadriceps"],
    secondaryMuscles: [],
    equipment: ["leg_extension_machine"],
    difficulty: "beginner",
    instructions: [
      "Sit in machine, pad over top of lower shin.",
      "Extend legs fully, squeezing quads at the top.",
      "Lower slowly.",
    ],
    commonMistakes: ["Going too heavy straining the knee", "Dropping the weight fast"],
  },
  {
    slug: "chest-press-machine",
    name: "Chest Press Machine",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["triceps", "anterior deltoid"],
    equipment: ["chest_press_machine"],
    difficulty: "beginner",
    instructions: [
      "Set seat so handles align with lower chest.",
      "Press forward to full extension.",
      "Return slowly under control.",
    ],
    commonMistakes: ["Seat too high or too low", "Arching off the pad"],
  },
  {
    slug: "pec-deck",
    name: "Pec Deck Fly",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["anterior deltoid"],
    equipment: ["pec_deck_machine"],
    difficulty: "beginner",
    instructions: [
      "Sit with back flat, elbows on pads at chest height.",
      "Bring arms together in front of chest.",
      "Return slowly, feeling the stretch.",
    ],
    commonMistakes: ["Rounding forward", "Elbows dropping below chest height"],
  },
  {
    slug: "shoulder-press-machine",
    name: "Machine Shoulder Press",
    primaryMuscles: ["anterior deltoid", "medial deltoid"],
    secondaryMuscles: ["triceps"],
    equipment: ["shoulder_press_machine"],
    difficulty: "beginner",
    instructions: [
      "Adjust seat so handles are at shoulder height.",
      "Press overhead to full extension.",
      "Lower with control.",
    ],
    commonMistakes: ["Not sitting tall", "Going too heavy too soon"],
  },
  // ── KETTLEBELL ────────────────────────────────────────────────────────────
  {
    slug: "kb-swing",
    name: "Kettlebell Swing",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["core", "erectors", "forearms"],
    equipment: ["kettlebell"],
    difficulty: "intermediate",
    instructions: [
      "Hinge at hips and swing the kettlebell back between your legs.",
      "Drive hips forward explosively, swinging the bell to chest height.",
      "Hinge back again as the bell falls — use hip power, not arms.",
    ],
    commonMistakes: ["Squatting instead of hinging", "Muscling with the arms", "Rounding the back"],
  },
  {
    slug: "kb-goblet-squat",
    name: "Kettlebell Goblet Squat",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core"],
    equipment: ["kettlebell"],
    difficulty: "beginner",
    instructions: [
      "Hold kettlebell by the horns at chest height.",
      "Squat deep, elbows between knees.",
      "Drive up through heels.",
    ],
    commonMistakes: ["Letting the bell pull you forward", "Knees caving in"],
  },
  {
    slug: "kb-turkish-getup",
    name: "Turkish Get-Up",
    primaryMuscles: ["core", "shoulders"],
    secondaryMuscles: ["glutes", "hips", "full body"],
    equipment: ["kettlebell"],
    difficulty: "intermediate",
    instructions: [
      "Lie on your back, hold kettlebell in one hand extended straight up.",
      "Use the other arm and same-side leg to roll to sitting.",
      "Press to standing, reversing the steps to return.",
    ],
    commonMistakes: ["Losing eye contact with the bell", "Rushing the movement"],
  },
  // ── RESISTANCE BAND ───────────────────────────────────────────────────────
  {
    slug: "band-pull-apart",
    name: "Band Pull-Apart",
    primaryMuscles: ["rear deltoid", "mid traps", "rhomboids"],
    secondaryMuscles: [],
    equipment: ["resistance_band"],
    difficulty: "beginner",
    instructions: [
      "Hold band in front at shoulder height, arms extended.",
      "Pull apart until band touches your chest.",
      "Return slowly.",
    ],
    commonMistakes: ["Shrugging the shoulders", "Arms dropping below shoulder height"],
  },
  {
    slug: "band-squat",
    name: "Banded Squat",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hip abductors"],
    equipment: ["resistance_band", "bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Place band just above the knees.",
      "Squat while pushing knees out against the band.",
      "Drive up through heels.",
    ],
    commonMistakes: ["Knees caving in", "Band too tight restricting depth"],
  },
  // ── CORE ──────────────────────────────────────────────────────────────────
  {
    slug: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    primaryMuscles: ["rectus abdominis", "hip flexors"],
    secondaryMuscles: ["obliques"],
    equipment: ["pull_up_bar"],
    difficulty: "intermediate",
    instructions: [
      "Hang from a bar with a dead hang.",
      "Raise legs until parallel to floor (or higher).",
      "Lower slowly without swinging.",
    ],
    commonMistakes: ["Swinging with momentum", "Bending knees to cheat"],
  },
  {
    slug: "ab-wheel-rollout",
    name: "Ab Wheel Rollout",
    primaryMuscles: ["rectus abdominis", "core"],
    secondaryMuscles: ["lats", "triceps"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Kneel on floor holding ab wheel.",
      "Roll forward, extending body, maintaining a neutral spine.",
      "Contract core to pull back to start.",
    ],
    commonMistakes: ["Hyperextending the lower back", "Going too far before you have the strength"],
  },
  {
    slug: "russian-twist",
    name: "Russian Twist",
    primaryMuscles: ["obliques"],
    secondaryMuscles: ["rectus abdominis"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Sit with knees bent, feet slightly off the floor.",
      "Clasp hands and rotate torso side to side.",
      "Keep back straight, not rounded.",
    ],
    commonMistakes: ["Rounding the back", "Moving only the arms instead of torso"],
  },
];

// ─── PROGRAM TEMPLATES ────────────────────────────────────────────────────────

type WorkoutDay = {
  label: string;
  name: string;
  order: number;
  exercises: {
    slug: string;
    order: number;
    sets: number;
    repsMin: number;
    repsMax: number;
    restSeconds: number;
  }[];
};

type TemplateDefinition = {
  name: string;
  description: string;
  goal: string;
  experience: string[];
  location: string;
  daysPerWeek: number;
  progressionModel: string;
  workouts: WorkoutDay[];
};

const templates: TemplateDefinition[] = [
  // ── 1. 3-Day Full Body Gym (Beginner) ─────────────────────────────────────
  {
    name: "3-Day Full Body (Gym, Beginner)",
    description: "A beginner-friendly 3-day full body program using compound barbell and dumbbell movements. Builds a foundation of strength and technique.",
    goal: "any",
    experience: ["new"],
    location: "gym",
    daysPerWeek: 3,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Full Body A", order: 1,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "barbell-bench-press", order: 2, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
          { slug: "cable-lat-pulldown", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-shoulder-press", order: 4, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "plank", order: 5, sets: 3, repsMin: 20, repsMax: 30, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Full Body B", order: 2,
        exercises: [
          { slug: "barbell-rdl", order: 1, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "db-row", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-incline-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-lateral-raise", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "glute-bridge", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
        ],
      },
      {
        label: "C", name: "Full Body C", order: 3,
        exercises: [
          { slug: "leg-press", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-row", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "push-up", order: 3, sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
          { slug: "cable-tricep-pushdown", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-curl", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
    ],
  },
  // ── 2. 4-Day Upper/Lower Gym (Intermediate) ───────────────────────────────
  {
    name: "4-Day Upper/Lower (Gym, Intermediate)",
    description: "A 4-day upper/lower split for intermediate lifters focused on building muscle. Combines compound and isolation movements.",
    goal: "build_muscle",
    experience: ["some", "regular"],
    location: "gym",
    daysPerWeek: 4,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Upper A", order: 1,
        exercises: [
          { slug: "barbell-bench-press", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "barbell-row", order: 2, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "db-incline-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-lat-pulldown", order: 4, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-lateral-raise", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "cable-tricep-pushdown", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-curl", order: 7, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Lower A", order: 2,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "barbell-rdl", order: 2, sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "leg-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "leg-curl", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "barbell-hip-thrust", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 90 },
          { slug: "reverse-crunch", order: 6, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
        ],
      },
      {
        label: "C", name: "Upper B", order: 3,
        exercises: [
          { slug: "barbell-overhead-press", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "cable-row", order: 2, sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "db-chest-fly", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "chin-up", order: 4, sets: 3, repsMin: 6, repsMax: 10, restSeconds: 120 },
          { slug: "cable-face-pull", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-tricep-extension", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-hammer-curl", order: 7, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "D", name: "Lower B", order: 4,
        exercises: [
          { slug: "barbell-deadlift", order: 1, sets: 4, repsMin: 4, repsMax: 6, restSeconds: 240 },
          { slug: "db-lunge", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "leg-extension", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "leg-curl", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "glute-bridge", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "plank", order: 6, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 60 },
        ],
      },
    ],
  },
  // ── 3. 5-Day PPL Gym (Regular) ────────────────────────────────────────────
  {
    name: "5-Day Push/Pull/Legs (Gym, Regular)",
    description: "A classic push/pull/legs split for experienced lifters looking to maximise muscle building volume.",
    goal: "build_muscle",
    experience: ["regular"],
    location: "gym",
    daysPerWeek: 5,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Push", order: 1,
        exercises: [
          { slug: "barbell-bench-press", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "db-incline-press", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "barbell-overhead-press", order: 3, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "db-lateral-raise", order: 4, sets: 4, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "pec-deck", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "cable-tricep-pushdown", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Pull", order: 2,
        exercises: [
          { slug: "barbell-row", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "cable-lat-pulldown", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-row", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-face-pull", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-curl", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-hammer-curl", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "C", name: "Legs", order: 3,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "barbell-rdl", order: 2, sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "leg-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "leg-curl", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "barbell-hip-thrust", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 90 },
          { slug: "leg-extension", order: 6, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
        ],
      },
      {
        label: "D", name: "Push B", order: 4,
        exercises: [
          { slug: "db-incline-press", order: 1, sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "chest-press-machine", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-shoulder-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-lateral-raise", order: 4, sets: 4, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-tricep-extension", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "E", name: "Pull B", order: 5,
        exercises: [
          { slug: "barbell-deadlift", order: 1, sets: 3, repsMin: 4, repsMax: 6, restSeconds: 240 },
          { slug: "chin-up", order: 2, sets: 4, repsMin: 6, repsMax: 10, restSeconds: 120 },
          { slug: "db-row", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-curl", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "cable-face-pull", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
        ],
      },
    ],
  },
  // ── 4. 3-Day Strength Gym (Intermediate) ──────────────────────────────────
  {
    name: "3-Day Strength (Gym, Intermediate)",
    description: "A powerlifting-style program focused on progressive overload on squat, bench, and deadlift for strength gains.",
    goal: "get_stronger",
    experience: ["some", "regular"],
    location: "gym",
    daysPerWeek: 3,
    progressionModel: "linear",
    workouts: [
      {
        label: "A", name: "Squat Day", order: 1,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 5, repsMin: 3, repsMax: 5, restSeconds: 240 },
          { slug: "barbell-bench-press", order: 2, sets: 4, repsMin: 4, repsMax: 6, restSeconds: 180 },
          { slug: "cable-row", order: 3, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "plank", order: 4, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Press Day", order: 2,
        exercises: [
          { slug: "barbell-overhead-press", order: 1, sets: 5, repsMin: 3, repsMax: 5, restSeconds: 240 },
          { slug: "barbell-deadlift", order: 2, sets: 3, repsMin: 4, repsMax: 6, restSeconds: 300 },
          { slug: "chin-up", order: 3, sets: 3, repsMin: 5, repsMax: 8, restSeconds: 180 },
          { slug: "cable-face-pull", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
        ],
      },
      {
        label: "C", name: "Deadlift Day", order: 3,
        exercises: [
          { slug: "barbell-deadlift", order: 1, sets: 5, repsMin: 3, repsMax: 5, restSeconds: 300 },
          { slug: "barbell-squat", order: 2, sets: 3, repsMin: 5, repsMax: 8, restSeconds: 180 },
          { slug: "barbell-row", order: 3, sets: 3, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "db-curl", order: 4, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        ],
      },
    ],
  },
  // ── 5. Home 3-Day Bodyweight (Beginner) ───────────────────────────────────
  {
    name: "Home 3-Day Bodyweight (Beginner)",
    description: "A beginner bodyweight program requiring no equipment. Build a base of strength and fitness from anywhere.",
    goal: "any",
    experience: ["new"],
    location: "home",
    daysPerWeek: 3,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Full Body A", order: 1,
        exercises: [
          { slug: "bodyweight-squat", order: 1, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "push-up", order: 2, sets: 3, repsMin: 8, repsMax: 15, restSeconds: 60 },
          { slug: "glute-bridge", order: 3, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "plank", order: 4, sets: 3, repsMin: 20, repsMax: 40, restSeconds: 45 },
          { slug: "mountain-climber", order: 5, sets: 3, repsMin: 20, repsMax: 30, restSeconds: 45 },
        ],
      },
      {
        label: "B", name: "Full Body B", order: 2,
        exercises: [
          { slug: "db-reverse-lunge", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
          { slug: "tricep-dip-bench", order: 2, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 60 },
          { slug: "superman-hold", order: 3, sets: 3, repsMin: 10, repsMax: 15, restSeconds: 45 },
          { slug: "reverse-crunch", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 45 },
          { slug: "hip-abduction", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 45 },
        ],
      },
      {
        label: "C", name: "Full Body C", order: 3,
        exercises: [
          { slug: "burpee", order: 1, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90 },
          { slug: "push-up", order: 2, sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
          { slug: "glute-bridge", order: 3, sets: 3, repsMin: 20, repsMax: 25, restSeconds: 60 },
          { slug: "plank", order: 4, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 45 },
          { slug: "russian-twist", order: 5, sets: 3, repsMin: 20, repsMax: 30, restSeconds: 45 },
        ],
      },
    ],
  },
  // ── 6. Home 4-Day Dumbbells (Intermediate) ────────────────────────────────
  {
    name: "Home 4-Day Dumbbells (Intermediate)",
    description: "A 4-day dumbbell program for home training. Upper/lower split targeting hypertrophy with minimal equipment.",
    goal: "build_muscle",
    experience: ["some"],
    location: "home",
    daysPerWeek: 4,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Upper A", order: 1,
        exercises: [
          { slug: "db-incline-press", order: 1, sets: 4, repsMin: 8, repsMax: 12, restSeconds: 90 },
          { slug: "db-row", order: 2, sets: 4, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-shoulder-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-lateral-raise", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-curl", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-tricep-extension", order: 6, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Lower A", order: 2,
        exercises: [
          { slug: "db-goblet-squat", order: 1, sets: 4, repsMin: 10, repsMax: 15, restSeconds: 90 },
          { slug: "db-rdl", order: 2, sets: 4, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-lunge", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "glute-bridge", order: 4, sets: 3, repsMin: 20, repsMax: 25, restSeconds: 60 },
          { slug: "hip-abduction", order: 5, sets: 3, repsMin: 20, repsMax: 25, restSeconds: 45 },
        ],
      },
      {
        label: "C", name: "Upper B", order: 3,
        exercises: [
          { slug: "db-chest-fly", order: 1, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "push-up", order: 2, sets: 3, repsMin: 10, repsMax: 20, restSeconds: 60 },
          { slug: "db-arnold-press", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-hammer-curl", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "tricep-dip-bench", order: 5, sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "D", name: "Lower B", order: 4,
        exercises: [
          { slug: "db-step-up", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-reverse-lunge", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "kb-goblet-squat", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 90 },
          { slug: "superman-hold", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 45 },
          { slug: "plank", order: 5, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 45 },
        ],
      },
    ],
  },
  // ── 7. Fat Loss Circuit Gym ────────────────────────────────────────────────
  {
    name: "Fat Loss Circuit (Gym, Beginner)",
    description: "A 3-day gym circuit designed to burn fat and maintain muscle through higher-rep training and short rest periods.",
    goal: "lose_fat",
    experience: ["new", "some"],
    location: "gym",
    daysPerWeek: 3,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Circuit A", order: 1,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "push-up", order: 2, sets: 3, repsMin: 12, repsMax: 20, restSeconds: 45 },
          { slug: "cable-row", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-lateral-raise", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 45 },
          { slug: "mountain-climber", order: 5, sets: 3, repsMin: 30, repsMax: 40, restSeconds: 45 },
        ],
      },
      {
        label: "B", name: "Circuit B", order: 2,
        exercises: [
          { slug: "barbell-rdl", order: 1, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-incline-press", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "cable-lat-pulldown", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "burpee", order: 4, sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
          { slug: "plank", order: 5, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 45 },
        ],
      },
      {
        label: "C", name: "Circuit C", order: 3,
        exercises: [
          { slug: "leg-press", order: 1, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "barbell-bench-press", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-row", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "mountain-climber", order: 4, sets: 3, repsMin: 30, repsMax: 40, restSeconds: 45 },
          { slug: "reverse-crunch", order: 5, sets: 3, repsMin: 20, repsMax: 25, restSeconds: 45 },
        ],
      },
    ],
  },
  // ── 8. Fat Loss HIIT Home ─────────────────────────────────────────────────
  {
    name: "Home Fat Loss HIIT (Beginner)",
    description: "A bodyweight HIIT-style program for fat loss at home. Short rest, high effort.",
    goal: "lose_fat",
    experience: ["new", "some"],
    location: "home",
    daysPerWeek: 3,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "HIIT A", order: 1,
        exercises: [
          { slug: "burpee", order: 1, sets: 4, repsMin: 10, repsMax: 15, restSeconds: 60 },
          { slug: "mountain-climber", order: 2, sets: 4, repsMin: 30, repsMax: 40, restSeconds: 45 },
          { slug: "push-up", order: 3, sets: 3, repsMin: 12, repsMax: 20, restSeconds: 45 },
          { slug: "bodyweight-squat", order: 4, sets: 3, repsMin: 20, repsMax: 30, restSeconds: 45 },
          { slug: "plank", order: 5, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 30 },
        ],
      },
      {
        label: "B", name: "HIIT B", order: 2,
        exercises: [
          { slug: "bodyweight-squat", order: 1, sets: 4, repsMin: 20, repsMax: 25, restSeconds: 45 },
          { slug: "push-up", order: 2, sets: 4, repsMin: 12, repsMax: 20, restSeconds: 45 },
          { slug: "glute-bridge", order: 3, sets: 3, repsMin: 20, repsMax: 25, restSeconds: 45 },
          { slug: "mountain-climber", order: 4, sets: 3, repsMin: 30, repsMax: 40, restSeconds: 45 },
          { slug: "russian-twist", order: 5, sets: 3, repsMin: 20, repsMax: 30, restSeconds: 30 },
        ],
      },
      {
        label: "C", name: "HIIT C", order: 3,
        exercises: [
          { slug: "burpee", order: 1, sets: 4, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "db-reverse-lunge", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 45 },
          { slug: "tricep-dip-bench", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 45 },
          { slug: "superman-hold", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 30 },
          { slug: "reverse-crunch", order: 5, sets: 3, repsMin: 20, repsMax: 25, restSeconds: 30 },
        ],
      },
    ],
  },
  // ── 9. General Fitness 4-Day ──────────────────────────────────────────────
  {
    name: "General Fitness 4-Day",
    description: "A balanced 4-day program for general fitness improvement. Mix of strength and conditioning movements.",
    goal: "general_fitness",
    experience: ["new", "some", "regular"],
    location: "both",
    daysPerWeek: 4,
    progressionModel: "volume_phases",
    workouts: [
      {
        label: "A", name: "Upper Push", order: 1,
        exercises: [
          { slug: "barbell-bench-press", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-shoulder-press", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "push-up", order: 3, sets: 3, repsMin: 12, repsMax: 20, restSeconds: 60 },
          { slug: "db-lateral-raise", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "cable-tricep-pushdown", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Lower", order: 2,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "barbell-rdl", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-lunge", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
          { slug: "glute-bridge", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "plank", order: 5, sets: 3, repsMin: 30, repsMax: 45, restSeconds: 45 },
        ],
      },
      {
        label: "C", name: "Upper Pull", order: 3,
        exercises: [
          { slug: "cable-lat-pulldown", order: 1, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-row", order: 2, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "db-row", order: 3, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "cable-face-pull", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-curl", order: 5, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ],
      },
      {
        label: "D", name: "Full Body Conditioning", order: 4,
        exercises: [
          { slug: "barbell-deadlift", order: 1, sets: 3, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "db-goblet-squat", order: 2, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "burpee", order: 3, sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
          { slug: "mountain-climber", order: 4, sets: 3, repsMin: 30, repsMax: 40, restSeconds: 45 },
          { slug: "russian-twist", order: 5, sets: 3, repsMin: 20, repsMax: 30, restSeconds: 45 },
        ],
      },
    ],
  },
  // ── 10. 5-Day Powerlifting Gym (Regular) ──────────────────────────────────
  {
    name: "5-Day Powerlifting (Gym, Regular)",
    description: "A 5-day program centered around maximal strength in squat, bench, and deadlift with accessory work.",
    goal: "get_stronger",
    experience: ["regular"],
    location: "gym",
    daysPerWeek: 5,
    progressionModel: "linear",
    workouts: [
      {
        label: "A", name: "Squat Heavy", order: 1,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 5, repsMin: 2, repsMax: 4, restSeconds: 300 },
          { slug: "barbell-rdl", order: 2, sets: 4, repsMin: 5, repsMax: 6, restSeconds: 180 },
          { slug: "leg-press", order: 3, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "leg-curl", order: 4, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: "plank", order: 5, sets: 3, repsMin: 30, repsMax: 60, restSeconds: 60 },
        ],
      },
      {
        label: "B", name: "Bench Heavy", order: 2,
        exercises: [
          { slug: "barbell-bench-press", order: 1, sets: 5, repsMin: 2, repsMax: 4, restSeconds: 300 },
          { slug: "cable-row", order: 2, sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: "db-incline-press", order: 3, sets: 3, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "cable-face-pull", order: 4, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-tricep-extension", order: 5, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        ],
      },
      {
        label: "C", name: "Deadlift Heavy", order: 3,
        exercises: [
          { slug: "barbell-deadlift", order: 1, sets: 5, repsMin: 2, repsMax: 4, restSeconds: 360 },
          { slug: "barbell-squat", order: 2, sets: 3, repsMin: 5, repsMax: 6, restSeconds: 240 },
          { slug: "barbell-row", order: 3, sets: 4, repsMin: 5, repsMax: 6, restSeconds: 180 },
          { slug: "chin-up", order: 4, sets: 3, repsMin: 5, repsMax: 8, restSeconds: 180 },
          { slug: "cable-crunch", order: 5, sets: 3, repsMin: 15, repsMax: 20, restSeconds: 60 },
        ],
      },
      {
        label: "D", name: "Squat Volume", order: 4,
        exercises: [
          { slug: "barbell-squat", order: 1, sets: 4, repsMin: 5, repsMax: 6, restSeconds: 240 },
          { slug: "barbell-hip-thrust", order: 2, sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "leg-extension", order: 3, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "leg-curl", order: 4, sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
          { slug: "ab-wheel-rollout", order: 5, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 60 },
        ],
      },
      {
        label: "E", name: "Bench Volume", order: 5,
        exercises: [
          { slug: "barbell-bench-press", order: 1, sets: 4, repsMin: 5, repsMax: 6, restSeconds: 240 },
          { slug: "barbell-overhead-press", order: 2, sets: 4, repsMin: 5, repsMax: 6, restSeconds: 180 },
          { slug: "cable-lat-pulldown", order: 3, sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: "db-lateral-raise", order: 4, sets: 4, repsMin: 15, repsMax: 20, restSeconds: 60 },
          { slug: "db-curl", order: 5, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Seeding exercises...");
  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: ex,
      create: ex,
    });
  }
  console.log(`Seeded ${exercises.length} exercises.`);

  console.log("Seeding program templates...");
  for (const tmpl of templates) {
    const { workouts, ...templateData } = tmpl;

    let pt = await prisma.programTemplate.findFirst({ where: { name: templateData.name } });
    if (pt) {
      pt = await prisma.programTemplate.update({ where: { id: pt.id }, data: templateData });
    } else {
      pt = await prisma.programTemplate.create({ data: templateData });
    }

    // Delete existing workout templates for idempotency
    const existingWorkouts = await prisma.workoutTemplate.findMany({
      where: { programTemplateId: pt.id },
    });
    for (const wt of existingWorkouts) {
      await prisma.workoutExerciseTemplate.deleteMany({ where: { workoutTemplateId: wt.id } });
    }
    await prisma.workoutTemplate.deleteMany({ where: { programTemplateId: pt.id } });

    for (const workout of workouts) {
      const { exercises: exSlots, ...workoutData } = workout;
      const wt = await prisma.workoutTemplate.create({
        data: { ...workoutData, programTemplateId: pt.id },
      });

      for (const slot of exSlots) {
        const { slug, ...slotData } = slot;
        const exercise = await prisma.exercise.findUnique({ where: { slug } });
        if (!exercise) {
          console.warn(`Exercise not found: ${slug}`);
          continue;
        }
        await prisma.workoutExerciseTemplate.create({
          data: { ...slotData, workoutTemplateId: wt.id, exerciseId: exercise.id },
        });
      }
    }
  }
  console.log(`Seeded ${templates.length} program templates.`);
  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
