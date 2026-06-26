import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Dumbbell, UtensilsCrossed, Scale, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Trophy, History, Check, Library, Pencil, ArrowLeft, LayoutDashboard, PersonStanding, Settings, Download, Upload, Timer, Copy } from "lucide-react";

// ---- Embedded plan library + muscle map ----
const ASSETS = {"BUILTIN_PLANS":[{"id":"builtin-nippard","name":"Jeff Nippard High Frequency Full Body","createdBy":"builtin","builtin":true,"structure":"weeks","weeks":[{"wk":1,"blk":1,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"BACK SQUAT","ws":"4","r":"4","rpe":"77.5%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"DUMBBELL INCLINE PRESS","ws":"3","r":"8","rpe":"RPE8","rest":"2-3 MIN","note":"~45 DEGREE INCLINE, MIND MUSCLE CONNECTION WITH UPPER PECS","mz":{"chest":1.0,"shoulders":0.5,"triceps":0.5}},{"n":"LYING LEG CURL","ws":"3","r":"10","rpe":"RPE6","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR HAMSTRINGS TO MOVE THE WEIGHT","mz":{"hamstrings":1.0}},{"n":"PRONATED PULLDOWN","ws":"3","r":"10","rpe":"RPE7","rest":"2-3 MIN","note":"PULL YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"15/15","rpe":"RPE9","rest":"1-2 MIN","note":"DROPSET. DROP WEIGHT BY ~50% ON SECOND 15 REPS. 30 REPS TOTAL.","mz":{"biceps":1.0}},{"n":"HANGING LEG RAISE","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"ROLL HIPS \"UP\" AS YOU SQUEEZE LOWER ABS, AVOID SWINGING","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"3","rpe":"85%","rest":"2-4 MIN","note":"SET UP A COMFORTABLE ARCH, 1-2 SECOND PAUSE ON CHEST, EXPLODE OFF CHEST WITH MAX FORCE","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW TO HIGH CABLE FLYE","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"START WITH YOUR HANDS OUT TO YOUR SIDES AND PALMS FACING THE CEILING, FOCUS ON PULLING YOUR ELBOWS UP AND IN WHILE ROTATING YOUR PALMS TO FACE THE FLOOR","mz":{"chest":1.0}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"3","r":"12","rpe":"RPE6","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"CHEST-SUPPORTED T-BAR ROW","ws":"3","r":"15","rpe":"RPE6","rest":"1-3 MIN","note":"SQUEEZE YOUR SHOULDER BLADES TOGETHER AT THE TOP, LET THEM ROUND FORWARD AT THE BOTTOM","mz":{"back":1.0,"biceps":0.5}},{"n":"ARNOLD PRESS","ws":"3","r":"10","rpe":"RPE7","rest":"1-3 MIN","note":"START WITH YOUR ELBOWS IN FRONT OF YOU AND PALMS FACING IN. ROTATE THE DUMBBELLS SO THAT YOUR PALMS FACE FORWARD AS YOU PRESS.","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"TRICEP PRESSDOWN","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE6","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"3","r":"6","rpe":"RPE8","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"HUMBLE ROW","ws":"3","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"PIN YOUR LOWER CHEST AGAINST THE TOP OF AN INCLINE BENCH: https://www.instagram.com/p/B5GeRJoBAc1/","mz":{"back":1.0,"biceps":0.5}},{"n":"LEG PRESS","ws":"3","r":"15","rpe":"RPE6","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"HAMMER CURL","ws":"3","r":"8","rpe":"RPE9","rest":"1-2 MIN","note":"3-SECOND ECCENTRIC. ARC THE DUMBBELL \"OUT\" NOT \"UP\", FOCUS ON SQUEEZING YOUR FOREARMS","mz":{"biceps":1.0,"forearms":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"DEADLIFT","ws":"4","r":"2","rpe":"85%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DIP","ws":"3","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"TUCK YOUR ELBOWS AT 45\u00b0, LEAN YOUR TORSO FORWARD 15\u00b0, SHOULDER WIDTH OR SLIGHTLY WIDER GRIP.","mz":{"chest":1.0,"triceps":1.0}},{"n":"GLUTE HAM RAISE","ws":"3","r":"10","rpe":"RPE6","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"ROPE FACE PULL","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"PULL YOUR ELBOWS UP AND OUT, SQUEEZE YOUR SHOULDER BLADES TOGETHER","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"4","r":"6","rpe":"75%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"EGYPTIAN LATERAL RAISE","ws":"3","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"2-SECOND ECCENTRIC. LEAN AWAY FROM THE CABLE, FOCUS ON SQUEEZING YOUR DELTS","mz":{"shoulders":1.0}},{"n":"CABLE SEATED ROW","ws":"3","r":"12","rpe":"RPE7","rest":"1-3 MIN","note":"FOCUS ON SQUEEZING YOUR SHOULDER BLADES TOGETHER, PULL WITH YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"INCLINE DUMBBELL CURL","ws":"2","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"BRACE UPPER BACK AGAINST BENCH, 45 DEGREE INCLINE, KEEP SHOULDERS BACK AS YOU CURL","mz":{"biceps":1.0}},{"n":"BICYCLE CRUNCH","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON FLEXING AND ROTATING YOUR SPINE, BRING YOUR LEFT ELBOW TO RIGHT KNEE, RIGHT ELBOW TO LEFT KNEE","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE6","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":2,"blk":1,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"BACK SQUAT","ws":"3","r":"6","rpe":"77.5%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"DUMBBELL INCLINE PRESS","ws":"3","r":"8","rpe":"RPE8","rest":"2-3 MIN","note":"~45 DEGREE INCLINE, MIND MUSCLE CONNECTION WITH UPPER PECS","mz":{"chest":1.0,"shoulders":0.5,"triceps":0.5}},{"n":"LYING LEG CURL","ws":"3","r":"10","rpe":"RPE6","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR HAMSTRINGS TO MOVE THE WEIGHT","mz":{"hamstrings":1.0}},{"n":"PRONATED PULLDOWN","ws":"3","r":"10","rpe":"RPE7","rest":"2-3 MIN","note":"PULL YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"15/15","rpe":"RPE9","rest":"1-2 MIN","note":"DROPSET. DROP WEIGHT BY ~50% ON SECOND 15 REPS. 30 REPS TOTAL.","mz":{"biceps":1.0}},{"n":"HANGING LEG RAISE","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"ROLL HIPS \"UP\" AS YOU SQUEEZE LOWER ABS, AVOID SWINGING","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"5","rpe":"80%","rest":"2-4 MIN","note":"SET UP A COMFORTABLE ARCH, 1-2 SECOND PAUSE ON CHEST, EXPLODE OFF CHEST WITH MAX FORCE","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW TO HIGH CABLE FLYE","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"START WITH YOUR HANDS OUT TO YOUR SIDES AND PALMS FACING THE CEILING, FOCUS ON PULLING YOUR ELBOWS UP AND IN WHILE ROTATING YOUR PALMS TO FACE THE FLOOR","mz":{"chest":1.0}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"3","r":"12","rpe":"RPE6","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"CHEST-SUPPORTED T-BAR ROW","ws":"3","r":"15","rpe":"RPE6","rest":"1-3 MIN","note":"SQUEEZE YOUR SHOULDER BLADES TOGETHER AT THE TOP, LET THEM ROUND FORWARD AT THE BOTTOM","mz":{"back":1.0,"biceps":0.5}},{"n":"ARNOLD PRESS","ws":"3","r":"10","rpe":"RPE7","rest":"1-3 MIN","note":"START WITH YOUR ELBOWS IN FRONT OF YOU AND PALMS FACING IN. ROTATE THE DUMBBELLS SO THAT YOUR PALMS FACE FORWARD AS YOU PRESS.","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"TRICEP PRESSDOWN","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE6","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"3","r":"6","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"HUMBLE ROW","ws":"3","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"PIN YOUR LOWER CHEST AGAINST THE TOP OF AN INCLINE BENCH: https://www.instagram.com/p/B5GeRJoBAc1/","mz":{"back":1.0,"biceps":0.5}},{"n":"LEG PRESS","ws":"3","r":"15","rpe":"RPE6","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"HAMMER CURL","ws":"3","r":"8","rpe":"RPE9","rest":"1-2 MIN","note":"3-SECOND ECCENTRIC. ARC THE DUMBBELL \"OUT\" NOT \"UP\", FOCUS ON SQUEEZING YOUR FOREARMS","mz":{"biceps":1.0,"forearms":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"RESET DEADLIFT","ws":"3","r":"5","rpe":"80%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DIP","ws":"3","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"TUCK YOUR ELBOWS AT 45\u00b0, LEAN YOUR TORSO FORWARD 15\u00b0, SHOULDER WIDTH OR SLIGHTLY WIDER GRIP.","mz":{"chest":1.0,"triceps":1.0}},{"n":"GLUTE HAM RAISE","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"ROPE FACE PULL","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"PULL YOUR ELBOWS UP AND OUT, SQUEEZE YOUR SHOULDER BLADES TOGETHER","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"4","r":"10","rpe":"65%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"EGYPTIAN LATERAL RAISE","ws":"3","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"2-SECOND ECCENTRIC. LEAN AWAY FROM THE CABLE, FOCUS ON SQUEEZING YOUR DELTS","mz":{"shoulders":1.0}},{"n":"CABLE SEATED ROW","ws":"3","r":"12","rpe":"RPE7","rest":"1-3 MIN","note":"FOCUS ON SQUEEZING YOUR SHOULDER BLADES TOGETHER, PULL WITH YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"INCLINE DUMBBELL CURL","ws":"2","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"BRACE UPPER BACK AGAINST BENCH, 45 DEGREE INCLINE, KEEP SHOULDERS BACK AS YOU CURL","mz":{"biceps":1.0}},{"n":"BICYCLE CRUNCH","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON FLEXING AND ROTATING YOUR SPINE, BRING YOUR LEFT ELBOW TO RIGHT KNEE, RIGHT ELBOW TO LEFT KNEE","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE6","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":3,"blk":1,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"BACK SQUAT","ws":"4","r":"4","rpe":"80%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"DUMBBELL INCLINE PRESS","ws":"3","r":"8","rpe":"RPE9","rest":"2-3 MIN","note":"~45 DEGREE INCLINE, MIND MUSCLE CONNECTION WITH UPPER PECS","mz":{"chest":1.0,"shoulders":0.5,"triceps":0.5}},{"n":"LYING LEG CURL","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR HAMSTRINGS TO MOVE THE WEIGHT","mz":{"hamstrings":1.0}},{"n":"PRONATED PULLDOWN","ws":"3","r":"10","rpe":"RPE7","rest":"2-3 MIN","note":"PULL YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"15/15","rpe":"RPE10","rest":"1-2 MIN","note":"DROPSET. DROP WEIGHT BY ~50% ON SECOND 15 REPS. 30 REPS TOTAL.","mz":{"biceps":1.0}},{"n":"HANGING LEG RAISE","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"ROLL HIPS \"UP\" AS YOU SQUEEZE LOWER ABS, AVOID SWINGING","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"3","rpe":"85%","rest":"2-4 MIN","note":"SET UP A COMFORTABLE ARCH, 1-2 SECOND PAUSE ON CHEST, EXPLODE OFF CHEST WITH MAX FORCE","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW TO HIGH CABLE FLYE","ws":"3","r":"15","rpe":"RPE9","rest":"1-2 MIN","note":"START WITH YOUR HANDS OUT TO YOUR SIDES AND PALMS FACING THE CEILING, FOCUS ON PULLING YOUR ELBOWS UP AND IN WHILE ROTATING YOUR PALMS TO FACE THE FLOOR","mz":{"chest":1.0}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"3","r":"12","rpe":"RPE7","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"CHEST-SUPPORTED T-BAR ROW","ws":"3","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"SQUEEZE YOUR SHOULDER BLADES TOGETHER AT THE TOP, LET THEM ROUND FORWARD AT THE BOTTOM","mz":{"back":1.0,"biceps":0.5}},{"n":"ARNOLD PRESS","ws":"3","r":"10","rpe":"RPE7","rest":"1-3 MIN","note":"START WITH YOUR ELBOWS IN FRONT OF YOU AND PALMS FACING IN. ROTATE THE DUMBBELLS SO THAT YOUR PALMS FACE FORWARD AS YOU PRESS.","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"TRICEP PRESSDOWN","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"3","r":"6","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"HUMBLE ROW","ws":"3","r":"10","rpe":"RPE9","rest":"2-3 MIN","note":"PIN YOUR LOWER CHEST AGAINST THE TOP OF AN INCLINE BENCH: https://www.instagram.com/p/B5GeRJoBAc1/","mz":{"back":1.0,"biceps":0.5}},{"n":"LEG PRESS","ws":"3","r":"15","rpe":"RPE7","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"HAMMER CURL","ws":"3","r":"8","rpe":"RPE9","rest":"1-2 MIN","note":"3-SECOND ECCENTRIC. ARC THE DUMBBELL \"OUT\" NOT \"UP\", FOCUS ON SQUEEZING YOUR FOREARMS","mz":{"biceps":1.0,"forearms":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"DEADLIFT","ws":"4","r":"2","rpe":"87.5%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DIP","ws":"3","r":"10","rpe":"RPE9","rest":"2-3 MIN","note":"TUCK YOUR ELBOWS AT 45\u00b0, LEAN YOUR TORSO FORWARD 15\u00b0, SHOULDER WIDTH OR SLIGHTLY WIDER GRIP.","mz":{"chest":1.0,"triceps":1.0}},{"n":"GLUTE HAM RAISE","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"ROPE FACE PULL","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"PULL YOUR ELBOWS UP AND OUT, SQUEEZE YOUR SHOULDER BLADES TOGETHER","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"4","r":"6","rpe":"77.5%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"EGYPTIAN LATERAL RAISE","ws":"3","r":"8","rpe":"RPE9","rest":"1-2 MIN","note":"2-SECOND ECCENTRIC. LEAN AWAY FROM THE CABLE, FOCUS ON SQUEEZING YOUR DELTS","mz":{"shoulders":1.0}},{"n":"CABLE SEATED ROW","ws":"3","r":"12","rpe":"RPE7","rest":"1-3 MIN","note":"FOCUS ON SQUEEZING YOUR SHOULDER BLADES TOGETHER, PULL WITH YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"INCLINE DUMBBELL CURL","ws":"2","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"BRACE UPPER BACK AGAINST BENCH, 45 DEGREE INCLINE, KEEP SHOULDERS BACK AS YOU CURL","mz":{"biceps":1.0}},{"n":"BICYCLE CRUNCH","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON FLEXING AND ROTATING YOUR SPINE, BRING YOUR LEFT ELBOW TO RIGHT KNEE, RIGHT ELBOW TO LEFT KNEE","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE7","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":4,"blk":1,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"BACK SQUAT","ws":"3","r":"5","rpe":"80%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"DUMBBELL INCLINE PRESS","ws":"3","r":"8","rpe":"RPE9","rest":"2-3 MIN","note":"~45 DEGREE INCLINE, MIND MUSCLE CONNECTION WITH UPPER PECS","mz":{"chest":1.0,"shoulders":0.5,"triceps":0.5}},{"n":"LYING LEG CURL","ws":"3","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR HAMSTRINGS TO MOVE THE WEIGHT","mz":{"hamstrings":1.0}},{"n":"PRONATED PULLDOWN","ws":"3","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"PULL YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"15/15","rpe":"RPE10","rest":"1-2 MIN","note":"DROPSET. DROP WEIGHT BY ~50% ON SECOND 15 REPS. 30 REPS TOTAL.","mz":{"biceps":1.0}},{"n":"HANGING LEG RAISE","ws":"3","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"ROLL HIPS \"UP\" AS YOU SQUEEZE LOWER ABS, AVOID SWINGING","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"5","rpe":"80%","rest":"2-4 MIN","note":"SET UP A COMFORTABLE ARCH, 1-2 SECOND PAUSE ON CHEST, EXPLODE OFF CHEST WITH MAX FORCE","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW TO HIGH CABLE FLYE","ws":"3","r":"15","rpe":"RPE9","rest":"1-2 MIN","note":"START WITH YOUR HANDS OUT TO YOUR SIDES AND PALMS FACING THE CEILING, FOCUS ON PULLING YOUR ELBOWS UP AND IN WHILE ROTATING YOUR PALMS TO FACE THE FLOOR","mz":{"chest":1.0}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"3","r":"12","rpe":"RPE8","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"CHEST-SUPPORTED T-BAR ROW","ws":"3","r":"15","rpe":"RPE8","rest":"1-3 MIN","note":"SQUEEZE YOUR SHOULDER BLADES TOGETHER AT THE TOP, LET THEM ROUND FORWARD AT THE BOTTOM","mz":{"back":1.0,"biceps":0.5}},{"n":"ARNOLD PRESS","ws":"3","r":"10","rpe":"RPE8","rest":"1-3 MIN","note":"START WITH YOUR ELBOWS IN FRONT OF YOU AND PALMS FACING IN. ROTATE THE DUMBBELLS SO THAT YOUR PALMS FACE FORWARD AS YOU PRESS.","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"TRICEP PRESSDOWN","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"3","r":"6","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"HUMBLE ROW","ws":"3","r":"10","rpe":"RPE9","rest":"2-3 MIN","note":"PIN YOUR LOWER CHEST AGAINST THE TOP OF AN INCLINE BENCH: https://www.instagram.com/p/B5GeRJoBAc1/","mz":{"back":1.0,"biceps":0.5}},{"n":"LEG PRESS","ws":"3","r":"15","rpe":"RPE8","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"3","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"HAMMER CURL","ws":"3","r":"8","rpe":"RPE9","rest":"1-2 MIN","note":"3-SECOND ECCENTRIC. ARC THE DUMBBELL \"OUT\" NOT \"UP\", FOCUS ON SQUEEZING YOUR FOREARMS","mz":{"biceps":1.0,"forearms":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"RESET DEADLIFT","ws":"3","r":"5","rpe":"80%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DIP","ws":"3","r":"10","rpe":"RPE9","rest":"2-3 MIN","note":"TUCK YOUR ELBOWS AT 45\u00b0, LEAN YOUR TORSO FORWARD 15\u00b0, SHOULDER WIDTH OR SLIGHTLY WIDER GRIP.","mz":{"chest":1.0,"triceps":1.0}},{"n":"GLUTE HAM RAISE","ws":"3","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE8","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"ROPE FACE PULL","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"PULL YOUR ELBOWS UP AND OUT, SQUEEZE YOUR SHOULDER BLADES TOGETHER","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"4","r":"10","rpe":"67.5%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"EGYPTIAN LATERAL RAISE","ws":"3","r":"8","rpe":"RPE9","rest":"1-2 MIN","note":"2-SECOND ECCENTRIC. LEAN AWAY FROM THE CABLE, FOCUS ON SQUEEZING YOUR DELTS","mz":{"shoulders":1.0}},{"n":"CABLE SEATED ROW","ws":"3","r":"12","rpe":"RPE8","rest":"1-3 MIN","note":"FOCUS ON SQUEEZING YOUR SHOULDER BLADES TOGETHER, PULL WITH YOUR ELBOWS DOWN AND IN","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"INCLINE DUMBBELL CURL","ws":"2","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"BRACE UPPER BACK AGAINST BENCH, 45 DEGREE INCLINE, KEEP SHOULDERS BACK AS YOU CURL","mz":{"biceps":1.0}},{"n":"BICYCLE CRUNCH","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON FLEXING AND ROTATING YOUR SPINE, BRING YOUR LEFT ELBOW TO RIGHT KNEE, RIGHT ELBOW TO LEFT KNEE","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE8","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":5,"blk":2,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"[TOPSET] BACK SQUAT","ws":"1","r":"3-5","rpe":"87.5%","rest":"2-4 MIN","note":"IF YOU\u2019RE FEELING STRONG AND CONFIDENT, GO FOR 5. IF YOU FEEL LESS STRONG, PLAY IT SAFE WITH 3-4 REPS.","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"[BACK OFF] BACK SQUAT","ws":"2","r":"5","rpe":"75%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"BARBELL OVERHEAD PRESS","ws":"4","r":"6","rpe":"80%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"SWISS BALL LEG CURL","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"PREVENT YOUR HIPS FROM TOUCHING THE GROUND. DIG YOUR HEELS INTO THE BALL","mz":{"hamstrings":1.0}},{"n":"CHIN-UP","ws":"4","r":"8","rpe":"RPE7","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"10+2","rpe":"RPE10","rest":"1-2 MIN","note":"10 REPS WITH GOOD CONTROL + 2 REPS WITH MODERATE CHEATING/MOMENTUM","mz":{"biceps":1.0}},{"n":"AB WHEEL ROLLOUT","ws":"3","r":"6","rpe":"RPE7","rest":"1-2 MIN","note":"SQUEEZE YOUR GLUTES, DON'T PULL FROM YOUR ARMS","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"3","rpe":"87.5%","rest":"2-4 MIN","note":"ELBOWS AT A 45\u00b0 ANGLE. SQUEEZE YOUR SHOULDER BLADES AND STAY FIRM ON THE BENCH","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW INCLINE DUMBBELL PRESS","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"15\u00b0 BENCH ANGLE. TUCK YOUR ELBOWS","mz":{"chest":1.0,"triceps":0.5}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"4","r":"12","rpe":"RPE7","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"DUMBBELL ROW","ws":"4","r":"12","rpe":"RPE7","rest":"1-3 MIN","note":"PULL THE DUMBBELL TO YOUR HIP","mz":{"back":1.0,"biceps":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"4","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"TILT THE DUMBBELL SUCH THAT YOUR PINKY COMES UP FIRST","mz":{"shoulders":1.0}},{"n":"OVERHEAD TRICEP EXTENSION","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"3","r":"6","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"BANDED CHEST- SUPPORTED T-BAR ROW","ws":"4","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"SQUEEZE YOUR SHOULDER BLADES TOGETHER AT THE TOP, LET THEM ROUND FORWARD AT THE BOTTOM","mz":{"back":1.0,"biceps":0.5}},{"n":"SINGLE-LEG LEG PRESS","ws":"4","r":"15","rpe":"RPE7","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"ECCENTRIC- ACCENTUATED STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES. 4-SECOND ECCENTRIC","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"4","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"CABLE SINGLE-ARM CURL","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"KEEP YOUR SHOULDER JOINT HYPEREXTENDED (ELBOW BEHIND TORSO)","mz":{"biceps":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"[TOPSET] DEADLIFT","ws":"1","r":"2","rpe":"90%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"[BACK OFF] RESET DEADLIFT","ws":"3","r":"2","rpe":"80%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DECLINE BENCH PRESS","ws":"4","r":"8","rpe":"RPE7","rest":"2-3 MIN","note":"CONSTANT TENSION REPS, TOUCH BAR TO CHEST","mz":{"chest":1.0,"triceps":0.5}},{"n":"GLUTE HAM RAISE","ws":"4","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"3","r":"8","rpe":"80%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"CABLE LATERAL RAISE","ws":"3","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"UP\"","mz":{"shoulders":1.0}},{"n":"PENDLAY ROW","ws":"4","r":"10","rpe":"RPE7","rest":"1-3 MIN","note":"KEEP A FLAT BACK, PULL YOUR ELBOWS BACK AT 45 DEGREE ANGLE","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"4","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"EZ BAR CURL 21S","ws":"2","r":"7/7/7","rpe":"RPE7","rest":"1-2 MIN","note":"FIRST 7 REPS BOTTOM HALF OF ROM, NEXT 7 REPS TOP HALF OF ROM, LAST 7 REPS FULL ROM","mz":{"biceps":1.0,"forearms":0.5}},{"n":"CABLE CRUNCH","ws":"4","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON FLEXING YOUR SPINE. AVOID YANKING WITH YOUR ARMS","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE7","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":6,"blk":2,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"[TOPSET] BACK SQUAT","ws":"1","r":"2","rpe":"90%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"[BACK OFF] BACK SQUAT","ws":"2","r":"3","rpe":"85%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"BARBELL OVERHEAD PRESS","ws":"4","r":"8","rpe":"75%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"SWISS BALL LEG CURL","ws":"3","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"PREVENT YOUR HIPS FROM TOUCHING THE GROUND. DIG YOUR HEELS INTO THE BALL","mz":{"hamstrings":1.0}},{"n":"CHIN-UP","ws":"4","r":"8","rpe":"RPE7","rest":"2-3 MIN","note":"SUPINATED (UNDERHAND) SHOULDER WIDTH GRIP, PULL WITH LATS","mz":{"back":1.0,"biceps":1.0}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"10+2","rpe":"RPE10","rest":"1-2 MIN","note":"10 REPS WITH GOOD CONTROL + 2 REPS WITH MODERATE CHEATING/MOMENTUM","mz":{"biceps":1.0}},{"n":"AB WHEEL ROLLOUT","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"SQUEEZE YOUR GLUTES, DON'T PULL FROM YOUR ARMS","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"5","rpe":"85%","rest":"2-4 MIN","note":"ELBOWS AT A 45\u00b0 ANGLE. SQUEEZE YOUR SHOULDER BLADES AND STAY FIRM ON THE BENCH","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW INCLINE DUMBBELL PRESS","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"15\u00b0 BENCH ANGLE. TUCK YOUR ELBOWS","mz":{"chest":1.0,"triceps":0.5}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"4","r":"12","rpe":"RPE7","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"DUMBBELL ROW","ws":"4","r":"12","rpe":"RPE7","rest":"1-3 MIN","note":"PULL THE DUMBBELL TO YOUR HIP","mz":{"back":1.0,"biceps":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"4","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"OVERHEAD TRICEP EXTENSION","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"4","r":"3","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"BANDED CHEST- SUPPORTED T-BAR ROW","ws":"4","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"BE EXPLOSIVE AT THE BOTTOM, DRIVE ELBOWS BACK HARD!","mz":{"back":1.0,"biceps":0.5}},{"n":"SINGLE-LEG LEG PRESS","ws":"4","r":"15","rpe":"RPE7","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"ECCENTRIC- ACCENTUATED STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES. 4-SECOND ECCENTRIC","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"4","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"CABLE SINGLE-ARM CURL","ws":"4","r":"8","rpe":"RPE7","rest":"1-2 MIN","note":"KEEP YOUR SHOULDER JOINT HYPEREXTENDED (ELBOW BEHIND TORSO)","mz":{"biceps":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"[TOPSET] DEADLIFT","ws":"1","r":"4","rpe":"85%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"[BACK OFF] RESET DEADLIFT","ws":"3","r":"4","rpe":"75%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DECLINE BENCH PRESS","ws":"4","r":"8","rpe":"RPE7","rest":"2-3 MIN","note":"CONSTANT TENSION REPS, TOUCH BAR TO CHEST","mz":{"chest":1.0,"triceps":0.5}},{"n":"GLUTE HAM RAISE","ws":"4","r":"10","rpe":"RPE7","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE7","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"REVERSE PEC DECK","ws":"3","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"BACK\"","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"4","r":"4","rpe":"82.5%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"CABLE LATERAL RAISE","ws":"3","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"UP\"","mz":{"shoulders":1.0}},{"n":"PENDLAY ROW","ws":"4","r":"12","rpe":"RPE7","rest":"1-3 MIN","note":"KEEP A FLAT BACK, PULL YOUR ELBOWS BACK AT 45 DEGREE ANGLE","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"4","r":"20","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"EZ BAR CURL 21S","ws":"2","r":"7/7/7","rpe":"RPE7","rest":"1-2 MIN","note":"FIRST 7 REPS BOTTOM HALF OF ROM, NEXT 7 REPS TOP HALF OF ROM, LAST 7 REPS FULL ROM","mz":{"biceps":1.0,"forearms":0.5}},{"n":"CABLE CRUNCH","ws":"4","r":"15","rpe":"RPE7","rest":"1-2 MIN","note":"FOCUS ON FLEXING YOUR SPINE. AVOID YANKING WITH YOUR ARMS","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE7","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE7","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":7,"blk":2,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"[TOPSET] BACK SQUAT","ws":"1","r":"6-8","rpe":"80%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"[BACK OFF] BACK SQUAT","ws":"2","r":"8","rpe":"70%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"BARBELL OVERHEAD PRESS","ws":"4","r":"10","rpe":"65%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"SWISS BALL LEG CURL","ws":"3","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"PREVENT YOUR HIPS FROM TOUCHING THE GROUND. DIG YOUR HEELS INTO THE BALL","mz":{"hamstrings":1.0}},{"n":"CHIN-UP","ws":"4","r":"8","rpe":"RPE8","rest":"2-3 MIN","note":"SUPINATED (UNDERHAND) SHOULDER WIDTH GRIP, PULL WITH LATS","mz":{"back":1.0,"biceps":1.0}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"10+2","rpe":"RPE10","rest":"1-2 MIN","note":"10 REPS WITH GOOD CONTROL + 2 REPS WITH MODERATE CHEATING/MOMENTUM","mz":{"biceps":1.0}},{"n":"AB WHEEL ROLLOUT","ws":"3","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"SQUEEZE YOUR GLUTES, DON'T PULL FROM YOUR ARMS","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"3","r":"10","rpe":"75%","rest":"2-4 MIN","note":"ELBOWS AT A 45\u00b0 ANGLE. SQUEEZE YOUR SHOULDER BLADES AND STAY FIRM ON THE BENCH","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW INCLINE DUMBBELL PRESS","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"15\u00b0 BENCH ANGLE. TUCK YOUR ELBOWS","mz":{"chest":1.0,"triceps":0.5}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"4","r":"12","rpe":"RPE8","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"DUMBBELL ROW","ws":"4","r":"12","rpe":"RPE8","rest":"1-3 MIN","note":"PULL THE DUMBBELL TO YOUR HIP","mz":{"back":1.0,"biceps":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"4","r":"15","rpe":"RPE8","rest":"1-3 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"OVERHEAD TRICEP EXTENSION","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"3","r":"10","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"BANDED CHEST- SUPPORTED T-BAR ROW","ws":"4","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"BE EXPLOSIVE AT THE BOTTOM, DRIVE ELBOWS BACK HARD!","mz":{"back":1.0,"biceps":0.5}},{"n":"SINGLE-LEG LEG PRESS","ws":"4","r":"15","rpe":"RPE8","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"ECCENTRIC- ACCENTUATED STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES. 4-SECOND ECCENTRIC","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"4","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"CABLE SINGLE-ARM CURL","ws":"4","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"KEEP YOUR SHOULDER JOINT HYPEREXTENDED (ELBOW BEHIND TORSO)","mz":{"biceps":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"[TOPSET] DEADLIFT","ws":"1","r":"6","rpe":"80%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"[BACK OFF] RESET DEADLIFT","ws":"3","r":"6","rpe":"70%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DECLINE BENCH PRESS","ws":"4","r":"8","rpe":"RPE 7","rest":"2-3 MIN","note":"CONSTANT TENSION REPS, TOUCH BAR TO CHEST","mz":{"chest":1.0,"triceps":0.5}},{"n":"GLUTE HAM RAISE","ws":"4","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"4","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE8","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"REVERSE PEC DECK","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"BACK\"","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"4","r":"6","rpe":"80%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"CABLE LATERAL RAISE","ws":"3","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"UP\"","mz":{"shoulders":1.0}},{"n":"PENDLAY ROW","ws":"4","r":"12","rpe":"RPE8","rest":"1-3 MIN","note":"KEEP A FLAT BACK, PULL YOUR ELBOWS BACK AT 45 DEGREE ANGLE","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"4","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"EZ BAR CURL 21S","ws":"2","r":"7/7/7","rpe":"RPE8","rest":"1-2 MIN","note":"FIRST 7 REPS BOTTOM HALF OF ROM, NEXT 7 REPS TOP HALF OF ROM, LAST 7 REPS FULL ROM","mz":{"biceps":1.0,"forearms":0.5}},{"n":"CABLE CRUNCH","ws":"4","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON FLEXING YOUR SPINE. AVOID YANKING WITH YOUR ARMS","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE7","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]},{"wk":8,"blk":2,"days":[{"d":1,"focus":"LOWER FOCUSED FULL BODY","ex":[{"n":"[TOPSET] BACK SQUAT","ws":"1","r":"2","rpe":"92.5%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"[BACK OFF] BACK SQUAT","ws":"2","r":"2","rpe":"85%","rest":"2-4 MIN","note":"SIT BACK AND DOWN, 15\u00b0 TOE FLARE, DRIVE YOUR KNEES OUT LATERALLY","mz":{"quads":1.0,"glutes":1.0,"hamstrings":0.5}},{"n":"BARBELL OVERHEAD PRESS","ws":"4","r":"5","rpe":"80%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"SWISS BALL LEG CURL","ws":"3","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"PREVENT YOUR HIPS FROM TOUCHING THE GROUND. DIG YOUR HEELS INTO THE BALL","mz":{"hamstrings":1.0}},{"n":"CHIN-UP","ws":"4","r":"8","rpe":"RPE8","rest":"2-3 MIN","note":"SUPINATED (UNDERHAND) SHOULDER WIDTH GRIP, PULL WITH LATS","mz":{"back":1.0,"biceps":1.0}},{"n":"SUPINATED EZ BAR CURL","ws":"3","r":"10+2","rpe":"RPE10","rest":"1-2 MIN","note":"10 REPS WITH GOOD CONTROL + 2 REPS WITH MODERATE CHEATING/MOMENTUM","mz":{"biceps":1.0}},{"n":"AB WHEEL ROLLOUT","ws":"3","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"SQUEEZE YOUR GLUTES, DON'T PULL FROM YOUR ARMS","mz":{"abs":1.0}}]},{"d":2,"focus":"CHEST FOCUSED FULL BODY","ex":[{"n":"BARBELL BENCH PRESS","ws":"4","r":"2","rpe":"90%","rest":"2-4 MIN","note":"ELBOWS AT A 45\u00b0 ANGLE. SQUEEZE YOUR SHOULDER BLADES AND STAY FIRM ON THE BENCH","mz":{"chest":1.0,"triceps":0.5,"shoulders":0.5}},{"n":"LOW INCLINE DUMBBELL PRESS","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"15\u00b0 BENCH ANGLE. TUCK YOUR ELBOWS","mz":{"chest":1.0,"triceps":0.5}},{"n":"BARBELL HIP THRUST OR ROMANIAN DEADLIFT","ws":"4","r":"12","rpe":"RPE8","rest":"2-3 MIN","note":"HIP THRUST IF GLUTES ARE PRIORITY, RDL IF HAMSTRINGS ARE PRIORITY FOR YOU. FOCUS ON MIND MUSCLE CONNECTION.","mz":{"glutes":1.0,"hamstrings":1.0}},{"n":"DUMBBELL ROW","ws":"4","r":"12","rpe":"RPE8","rest":"1-3 MIN","note":"PULL THE DUMBBELL TO YOUR HIP","mz":{"back":1.0,"biceps":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"4","r":"15","rpe":"RPE8","rest":"1-3 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"OVERHEAD TRICEP EXTENSION","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR TRICEPS TO MOVE THE WEIGHT","mz":{"triceps":1.0}},{"n":"HEX BAR OR SMITH MACHINE SHRUG","ws":"3","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"SHRUG UP AND IN, PULL SHOULDERS UP TO EARS!","mz":{"back":1.0,"shoulders":0.5}}]},{"d":3,"focus":"BACK FOCUSED FULL BODY","ex":[{"n":"WEIGHTED PULL-UP","ws":"4","r":"6","rpe":"RPE9","rest":"2-3 MIN","note":"1.5X SHOULDER WIDTH GRIP, PULL YOUR CHEST TO THE BAR","mz":{"back":1.0,"biceps":1.0}},{"n":"BANDED CHEST- SUPPORTED T-BAR ROW","ws":"4","r":"10","rpe":"RPE8","rest":"2-3 MIN","note":"BE EXPLOSIVE AT THE BOTTOM, DRIVE ELBOWS BACK HARD!","mz":{"back":1.0,"biceps":0.5}},{"n":"SINGLE-LEG LEG PRESS","ws":"4","r":"15","rpe":"RPE8","rest":"2-3 MIN","note":"LOW/MEDIUM/HIGH FOOT PLACEMENT, DON'T ALLOW YOUR LOWER BACK TO ROUND","mz":{"quads":1.0,"glutes":0.5}},{"n":"ECCENTRIC- ACCENTUATED STANDING CALF RAISE","ws":"4","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"PRESS ONTO YOUR TOES. 4-SECOND ECCENTRIC","mz":{"calves":1.0}},{"n":"CABLE ROPE UPRIGHT ROW","ws":"4","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING THE UPPER TRAPS AT THE TOP","mz":{"shoulders":1.0,"back":0.5}},{"n":"CABLE SINGLE-ARM CURL","ws":"4","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"KEEP YOUR SHOULDER JOINT HYPEREXTENDED (ELBOW BEHIND TORSO)","mz":{"biceps":1.0}}]},{"d":4,"focus":"LOWER FOCUSED FULL BODY 2","ex":[{"n":"[TOPSET] DEADLIFT","ws":"1","r":"2","rpe":"95%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"[BACK OFF] RESET DEADLIFT","ws":"1","r":"3","rpe":"85%","rest":"3-5 MIN","note":"BRACE YOUR LATS, CHEST TALL, HIPS HIGH, PULL THE SLACK OUT OF THE BAR PRIOR TO MOVING IT OFF THE GROUND","mz":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},{"n":"DECLINE BENCH PRESS","ws":"4","r":"8","rpe":"RPE 8","rest":"2-3 MIN","note":"CONSTANT TENSION REPS, TOUCH BAR TO CHEST","mz":{"chest":1.0,"triceps":0.5}},{"n":"GLUTE HAM RAISE","ws":"4","r":"10","rpe":"RPE8","rest":"1-2 MIN","note":"KEEP LOWER BACK STRAIGHT, USE HAMSTRINGS TO CURL YOUR BODY UP","mz":{"hamstrings":1.0,"glutes":0.5}},{"n":"LEG EXTENSION","ws":"4","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON SQUEEZING YOUR QUADS TO MOVE THE WEIGHT","mz":{"quads":1.0}},{"n":"CABLE PULL-OVER","ws":"3","r":"15","rpe":"RPE8","rest":"1-3 MIN","note":"LEAN YOUR TORSO AT A 45\u00b0 ANGLE, FOCUS ON PULLING THE WEIGHT STRAIGHT DOWN, NOT \"IN\"","mz":{"back":1.0,"chest":0.5}},{"n":"DUMBBELL LATERAL RAISE","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"RAISE THE DUMBBELL \"OUT\" NOT \"UP\", MIND MUSCLE CONNECTION WITH MIDDLE FIBERS","mz":{"shoulders":1.0}},{"n":"REVERSE PEC DECK","ws":"3","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"BACK\"","mz":{"shoulders":1.0,"back":0.5}},{"n":"EZ BAR SKULL CRUSHER","ws":"3","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"ARC THE BAR BACK BEHIND YOUR HEAD, KEEP CONSTANT TENSION ON TRICEPS","mz":{"triceps":1.0}}]},{"d":5,"focus":"DELTOID FOCUSED FULL BODY","ex":[{"n":"OVERHEAD PRESS","ws":"5","r":"3","rpe":"87.5%","rest":"2-3 MIN","note":"SQUEEZE YOUR GLUTES TO KEEP YOUR TORSO UPRIGHT, CLEAR YOUR HEAD OUT OF THE WAY, PRESS UP AND SLIGHTLY BACK","mz":{"shoulders":1.0,"triceps":0.5}},{"n":"CABLE LATERAL RAISE","ws":"3","r":"8","rpe":"RPE8","rest":"1-2 MIN","note":"SWING THE WEIGHT \"OUT\", NOT \"UP\"","mz":{"shoulders":1.0}},{"n":"PENDLAY ROW","ws":"4","r":"12","rpe":"RPE8","rest":"1-3 MIN","note":"KEEP A FLAT BACK, PULL YOUR ELBOWS BACK AT 45 DEGREE ANGLE","mz":{"back":1.0,"biceps":0.5}},{"n":"SEATED HIP ABDUCTION","ws":"4","r":"20","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON DRIVING YOUR KNEES OUT","mz":{"glutes":1.0}},{"n":"EZ BAR CURL 21S","ws":"2","r":"7/7/7","rpe":"RPE8","rest":"1-2 MIN","note":"FIRST 7 REPS BOTTOM HALF OF ROM, NEXT 7 REPS TOP HALF OF ROM, LAST 7 REPS FULL ROM","mz":{"biceps":1.0,"forearms":0.5}},{"n":"CABLE CRUNCH","ws":"4","r":"15","rpe":"RPE8","rest":"1-2 MIN","note":"FOCUS ON FLEXING YOUR SPINE. AVOID YANKING WITH YOUR ARMS","mz":{"abs":1.0}},{"n":"STANDING CALF RAISE","ws":"4","r":"12","rpe":"RPE8","rest":"1-2 MIN","note":"1-2 SECOND PAUSE AT THE BOTTOM OF EACH REP","mz":{"calves":1.0}},{"n":"PUSH UP","ws":"2","r":"RPE ONLY","rpe":"RPE7","rest":"1-2 MIN","note":"PERFORM AS MANY REPS AS YOU CAN TO HIT TARGET RPE","mz":{"chest":1.0,"triceps":0.5}}]}]}]}],"MUSCLE_MAP":{"AB WHEEL ROLLOUT":{"abs":1.0},"ARNOLD PRESS":{"shoulders":1.0,"triceps":0.5},"BACK SQUAT":{"quads":1.0,"glutes":1.0,"hamstrings":0.5},"BANDED CHEST- SUPPORTED T-BAR ROW":{"back":1.0,"biceps":0.5},"BARBELL BENCH PRESS":{"chest":1.0,"triceps":0.5,"shoulders":0.5},"BARBELL HIP THRUST OR ROMANIAN DEADLIFT":{"glutes":1.0,"hamstrings":1.0},"BARBELL OVERHEAD PRESS":{"shoulders":1.0,"triceps":0.5},"BICYCLE CRUNCH":{"abs":1.0},"CABLE CRUNCH":{"abs":1.0},"CABLE LATERAL RAISE":{"shoulders":1.0},"CABLE PULL-OVER":{"back":1.0,"chest":0.5},"CABLE ROPE UPRIGHT ROW":{"shoulders":1.0,"back":0.5},"CABLE SEATED ROW":{"back":1.0,"biceps":0.5},"CABLE SINGLE-ARM CURL":{"biceps":1.0},"CHEST-SUPPORTED T-BAR ROW":{"back":1.0,"biceps":0.5},"CHIN-UP":{"back":1.0,"biceps":1.0},"DEADLIFT":{"back":1.0,"hamstrings":1.0,"glutes":1.0},"DECLINE BENCH PRESS":{"chest":1.0,"triceps":0.5},"DIP":{"chest":1.0,"triceps":1.0},"DUMBBELL INCLINE PRESS":{"chest":1.0,"shoulders":0.5,"triceps":0.5},"DUMBBELL LATERAL RAISE":{"shoulders":1.0},"DUMBBELL ROW":{"back":1.0,"biceps":0.5},"ECCENTRIC- ACCENTUATED STANDING CALF RAISE":{"calves":1.0},"EGYPTIAN LATERAL RAISE":{"shoulders":1.0},"EZ BAR CURL 21S":{"biceps":1.0,"forearms":0.5},"EZ BAR SKULL CRUSHER":{"triceps":1.0},"GLUTE HAM RAISE":{"hamstrings":1.0,"glutes":0.5},"HAMMER CURL":{"biceps":1.0,"forearms":1.0},"HANGING LEG RAISE":{"abs":1.0},"HEX BAR OR SMITH MACHINE SHRUG":{"back":1.0,"shoulders":0.5},"HUMBLE ROW":{"back":1.0,"biceps":0.5},"INCLINE DUMBBELL CURL":{"biceps":1.0},"LEG EXTENSION":{"quads":1.0},"LEG PRESS":{"quads":1.0,"glutes":0.5},"LOW INCLINE DUMBBELL PRESS":{"chest":1.0,"triceps":0.5},"LOW TO HIGH CABLE FLYE":{"chest":1.0},"LYING LEG CURL":{"hamstrings":1.0},"OVERHEAD PRESS":{"shoulders":1.0,"triceps":0.5},"OVERHEAD TRICEP EXTENSION":{"triceps":1.0},"PENDLAY ROW":{"back":1.0,"biceps":0.5},"PRONATED PULLDOWN":{"back":1.0,"biceps":0.5},"PUSH UP":{"chest":1.0,"triceps":0.5},"RESET DEADLIFT":{"back":1.0,"hamstrings":1.0,"glutes":1.0},"REVERSE PEC DECK":{"shoulders":1.0,"back":0.5},"ROPE FACE PULL":{"shoulders":1.0,"back":0.5},"SEATED HIP ABDUCTION":{"glutes":1.0},"SINGLE-LEG LEG PRESS":{"quads":1.0,"glutes":0.5},"STANDING CALF RAISE":{"calves":1.0},"SUPINATED EZ BAR CURL":{"biceps":1.0},"SWISS BALL LEG CURL":{"hamstrings":1.0},"TRICEP PRESSDOWN":{"triceps":1.0},"WEIGHTED PULL-UP":{"back":1.0,"biceps":1.0},"[BACK OFF] BACK SQUAT":{"quads":1.0,"glutes":1.0,"hamstrings":0.5},"[TOPSET] BACK SQUAT":{"quads":1.0,"glutes":1.0,"hamstrings":0.5},"[BACK OFF] RESET DEADLIFT":{"back":1.0,"hamstrings":1.0,"glutes":1.0},"[TOPSET] DEADLIFT":{"back":1.0,"hamstrings":1.0,"glutes":1.0}},"ZONES":["chest","back","shoulders","biceps","triceps","quads","hamstrings","glutes","calves","abs","forearms"]};
const BUILTIN_PLANS=ASSETS.BUILTIN_PLANS, MUSCLE_MAP=ASSETS.MUSCLE_MAP, ZONES=ASSETS.ZONES;

// ---- Embedded anatomical bodies (MIT: react-native-body-highlighter) ----
const BODIES = {"maleFront":[{"z":"chest","d":"M272.91 422.84c-18.95-17.19-22-57-12.64-78.79 5.57-12.99 26.54-24.37 39.97-25.87q20.36-2.26 37.02.75c9.74 1.76 16.13 15.64 18.41 25.04 3.99 16.48 3.23 31.38 1.67 48.06q-1.35 14.35-2.05 16.89c-6.52 23.5-38.08 29.23-58.28 24.53-9.12-2.12-17.24-4.38-24.1-10.61z"},{"z":"chest","d":"M416.04 435c-15.12.11-34.46-6.78-41.37-21.48q-1.88-3.99-2.84-12.18c-2.89-24.41-5.9-53.65 8.44-74.79 4.26-6.26 10.49-7.93 18.36-8.56q11.66-.92 23.32-.35c10.58.53 18.02 2.74 26.62 7.87 12.81 7.65 19.73 14.52 22.67 29.75 4.94 25.57.24 64.14-28.21 74.97q-12.26 4.67-26.99 4.77z"},{"z":"abs","d":"M264.21 435.53c-4.88-3.13-5.75-12.11-5.39-17.36q.03-.53.51-.75 1.8-.84 3.43.85 10.05 10.45 22.57 16.9c3.64 1.89 5.54 3.62 4.79 7.8q-.42 2.35-2.82 1.87-12.45-2.49-23.09-9.31z"},{"z":"abs","d":"M287.33 452.44c-4.05 4.46-10.38 11.38-16.28 14.3a.84.83 51.1 01-.9-.1c-6.29-5.17-12.54-18.97-14.21-25.09q-.91-3.34.85-8.81.12-.39.35-.05c2.41 3.65 4.59 7.74 8.67 9.76q10.18 5.05 21.27 9.01a.61.61 0 01.25.98z"},{"z":"abs","d":"M297.3 487.82c-7.36-4.23-16.68-11.37-20.55-17.57q-.32-.5.09-.92 8.72-9.04 19.84-17.87 1.46-1.17 2.81-1.67a.44.44 0 01.59.43c-.28 10.08-.4 20.42.65 30.43q.34 3.26-.68 6.15a1.9 1.9 0 01-2.75 1.02z"},{"z":"abs","d":"M257.35 456.18l13.68 16.63a1.86 1.82 22.9 01.4.95c.59 5.4-2.02 12.71-3.8 17.56q-.3.84-.84.13-11.85-15.55-9.77-35.17.04-.45.33-.1z"},{"z":"abs","d":"M271.69 494.07a1.53 1.52-61.8 01-.49-1.64l4.2-13.58a.98.98 0 011.51-.5c3.2 2.32 21.89 14.05 22.26 16.7q1.15 8.32.66 16.79a.9.9 0 01-1.34.73q-14.24-8.05-26.8-18.5z"},{"z":"abs","d":"M299.35 544.62c-7.52-6.03-16.15-13.43-24.23-21.24-6.93-6.7-6-17.19-4.88-26.06a.44.44 0 01.72-.28q13.31 11.88 28.41 21.38.43.27.6.75c2.33 6.49.95 18.37-.07 25.23q-.09.59-.55.22z"},{"z":"abs","d":"M299.09 575.53c-7.98-3.65-27.57-15.86-28.06-26.2q-.57-11.91.46-24.3a.36.36 0 01.67-.15q.84 1.36 2.17 2.54 10.59 9.45 21.68 18.31c4.37 3.49 4.34 6.46 4.16 11.74q-.3 8.82-.42 17.64-.01.72-.66.42z"},{"z":"abs","d":"M308.17 657.58c-7.39-.13-12.41-4.13-17.14-9.39q-11.86-13.22-23.92-26.37-.33-.36-.33-.85.09-23.18 1.81-46.22.53-7.13 2.49-14.41a.71.71 0 011.2-.3q11.54 12.06 25.82 21.1 3.36 2.12 3.62 5.17 2.06 23.67 3.86 47.36c.58 7.62 2.31 13.36 4.43 20.82q.47 1.66-.96 2.79-.39.31-.88.3z"},{"z":"abs","d":"M438.7 444.36c-2.09-4.03-.13-6.83 3.63-8.81 10.22-5.36 16.79-11 24.23-18.07a1.71 1.71 0 012.89 1.12c.33 4.74-.81 14.39-5.53 17.22-4.68 2.82-18.74 10.02-24.39 9.14q-.57-.09-.83-.6z"},{"z":"abs","d":"M457.39 466.73c-3.72-1.02-13.2-10.29-16.5-14.49a.52.52 0 01.24-.81q10.94-3.75 21.31-9c3.96-2.01 6.3-5.98 8.57-9.58q.38-.59.55.09c.82 3.33 1.54 6.17.38 9.58-2.55 7.44-7.62 18.79-13.66 24.01a.96.96 0 01-.89.2z"},{"z":"abs","d":"M428.43 487.22c-1.01-1.79-.82-4.55-.71-6.72q.78-15.08.48-30.27-.01-.59.55-.4 1.72.59 3.02 1.64 11.58 9.37 18.82 16.95c3.86 4.05-16.2 17.42-19.56 19.48a1.87 1.86 59.6 01-2.6-.68z"},{"z":"abs","d":"M470.76 456.28a.25.25 0 01.44.13q2.03 19.67-9.8 35.22-.37.48-.6-.08c-1.37-3.29-5.86-16.13-3.51-18.91q6.3-7.47 13.47-16.36z"},{"z":"abs","d":"M452.27 478.5c1.13.49 4.28 12.47 4.78 14.38q.14.5-.23.88-1.29 1.35-2.65 2.41-10.44 8.12-21.76 14.97-1.49.9-2.91 1.33a.81.81 0 01-1.05-.71q-.73-8.62.67-17.15.08-.47.44-.8c1.74-1.6 21.96-15.73 22.34-15.51a.58.03 31 00.37.2z"},{"z":"abs","d":"M428.22 519.14q.11-.36.43-.56 15.3-9.66 28.83-21.69a.43.42-22.6 01.71.29c.51 8.26 2.25 18.67-4.46 25.4q-11.8 11.84-25.03 22.09-.43.34-.49-.2c-.75-6.82-1.97-18.92.01-25.33z"},{"z":"abs","d":"M456.54 524.55a.04.04 0 01.07.02q1.52 13.67.41 27.4-.04.47-.28.88c-4.97 8.3-18.23 19.62-27.88 22.63q-.57.17-.58-.43-.05-10.31-.27-20.53-.1-4.8 2.63-7.09c8.54-7.13 18.56-14.62 25.9-22.88z"},{"z":"abs","d":"M418.89 657.11q-1.12-1.67-.43-3.63 3.27-9.38 4.04-18.23 1.97-22.81 3.58-45.65c.16-2.32.72-6.41 2.84-7.71q14.97-9.23 27.16-21.93.41-.42.71.08 1.29 2.15 1.53 4.2 3.23 27.74 3.13 56.8a1.3 1.28-24.5 01-.33.86q-12.74 13.93-25.55 27.75c-4.8 5.17-9.09 7.87-15.73 7.96q-.61.01-.95-.5z"},{"z":"abs","d":"M311.02 531.71a.23.23 0 01-.19-.21q-.39-10.47 1.9-20.76c1.26-5.69 7.66-9.9 13.1-12.9 9.09-5.01 18.93-11.15 28.56-14.92a1.24 1.21-42.6 01.94.03c3.28 1.52 4.78 3.87 4.82 7.68q.13 13.16-.15 26.31c-.08 3.85.78 8.39-.87 13.1q-.17.46-.59.72-2.65 1.65-4.29 1.82-21.06 2.22-43.23-.87z"},{"z":"abs","d":"M321 577.76c-5.17-.33-8.71-.44-10-6.26q-3.2-14.44-.59-27.83.11-.53.64-.63c7.58-1.44 13.62-2.45 22.45-4.56q11.5-2.76 23.94-1.88c3.67.26 3.3 3.46 3.4 6.21q.46 12.55-.33 26.94-.25 4.41-1.81 8.08-.21.49-.73.6-1.39.28-3.22.29-16.89.14-33.75-.96z"},{"z":"abs","d":"M347.73 429.25c7.46-3.61 10.5 6.27 10.99 11.52.48 5.06 3.46 30.61-2.78 32.93q-4.17 1.55-6.89 3.33-17.56 11.54-35.88 21.46a1.6 1.59-21.9 01-2.3-.98c-2.87-10.41-10.59-43.96 1.66-50.95 11.3-6.45 23.96-11.86 35.2-17.31z"},{"z":"abs","d":"M350.35 712.81c-29.15-9.93-37.98-100.69-39.47-126.61a.99.99 0 01.33-.8c3.58-3.26 27.61-1.47 34.62-.93 4.41.34 15.27 1.31 15.26 7.53-.05 40.77.64 82.05-1.96 122.72a1.29 1.29 0 01-1.86 1.08c-2.3-1.14-4.12-2.04-6.92-2.99z"},{"z":"abs","d":"M371.94 473.31c-5.46-2.59-2.97-24.26-2.77-29.56.25-6.8 2.41-18.63 12.64-13.8q16.26 7.67 32.34 15.72 6.18 3.1 7.13 10.05c.58 4.26 1.35 8.49 1.07 12.72q-.84 12.55-4.33 26.56-.54 2.16-1.1 3.44-.25.58-.81.31c-15.78-7.29-30.79-19.08-44.17-25.44z"},{"z":"abs","d":"M382.57 533.27c-4.17-.18-9.56-.3-13.15-2.69q-.17-.11-.24-.31c-1.82-5.55-.86-11.17-.96-15.66-.18-8.4-.78-17.36.06-25.71.29-2.85 1.88-4.42 4.15-5.79q.42-.26.91-.19 1.71.25 3.21 1.03 12.48 6.44 24.75 13.26c4.96 2.75 12.21 7.02 13.72 12.41q2.93 10.56 2.39 21.49a.77.76-1.8 01-.67.71q-16.89 2.18-34.17 1.45z"},{"z":"abs","d":"M373.75 578.69c-2.47 0-4.31.22-5-2.7-1.8-7.7-3.05-34.29-.19-38.81q.27-.43.77-.47 13.14-1.24 25.77 1.83c8.41 2.04 14.51 3.01 21.85 4.36a1.29 1.28.6 011.05 1.07q2.16 14.12-.73 28.07c-1.08 5.24-5.22 5.26-10.36 5.63q-14.26 1.04-33.16 1.02z"},{"z":"abs","d":"M416.32 584.73q1.14.41 1.07 1.62c-1.62 26.44-9.96 116.68-40.43 126.74-2.27.75-4.15 2.12-6.35 2.73q-1.18.33-1.3-.89-.86-9.2-1.06-17.75c-.83-35.67-.91-71.2-1.01-106.88q0-.5.31-.89c4.95-6.46 41.69-7.25 48.77-4.68z"},{"z":"biceps","d":"M189.52 492.51c-2.43.62-7.38.57-7.51-3.08-.56-16.01-.42-35.49 5.11-50.26 3.19-8.54 13.89-30.22 23.27-32.72 10.08-2.68 12.68 16.59 12.6 22.8-.22 15.98-7.51 34.79-15.05 48.71-4.29 7.94-9.95 12.38-18.42 14.55z"},{"z":"biceps","d":"M526.69 486.31c-9.9-8.61-17.75-33.21-20.65-47.73-1.41-7.06-1.34-29.61 8.58-32.16 10.33-2.66 23.81 25.34 26.6 32.91q2.6 7.04 3.6 16.13 1.62 14.66 1.66 32.28c.03 11.04-16.45 1.48-19.79-1.43z"},{"z":"triceps","d":"M206.2 514.2c-5.41-.67-6.55-7.29-4.69-11.42 11.08-24.55 22.84-50.62 30.54-75.51 1.37-4.41 3.08-8.59 3.95-12.45q2.94-13.12 5.79-26.26.42-1.98 1.82-3.39a.52.52 0 01.81.1q1.04 1.69 1.94 4.56 4.63 14.65 5.15 24.92c.57 11.36-5.11 24.55-8.65 35.5q-7.69 23.78-20.25 45.39c-2.45 4.23-11.51 19.18-16.41 18.56z"},{"z":"triceps","d":"M517.69 512.06c-20.07-22.12-28.95-51.73-38.01-79.03-3.27-9.87-3.58-19.18-1.34-29.38 1.29-5.88 2.49-13.03 5.61-18.52q.32-.57.72-.06 1.35 1.67 1.79 3.69c2.67 12.33 5.14 24.49 9.07 36.52 8.25 25.28 18.58 49.8 31.1 77.2q1.42 3.1 1.05 5.33c-.81 4.89-5.46 9.25-9.99 4.25z"},{"z":"base","d":"M362.65 290.52q-1.14-1.37-1.86-3.41-5.33-15.15-12.14-29.75c-2.37-5.06-1.07-9.07-7.92-10.99q-1.01-.28.02-.47c5.98-1.08 15.25.91 21.33 2q2.37.42 4.81-.09 10.09-2.13 20.45-2.12a.37.37 0 01.08.73c-6.34 1.46-5.45 5.64-7.57 10.21q-6.1 13.1-11 26.69-1.3 3.62-2.9 6.81a1.99 1.99 0 01-3.3.39z"},{"z":"base","d":"M354.01 315.07q-3.49-3.65-5.9-8.23c-6.46-12.3-11.03-25.42-16.12-38.77-2.92-7.66-1.98-19.44-1.61-27.6q.03-.58.47-.21c9.06 7.39 11.33 17.46 15.67 27.62 5.4 12.61 15.4 33.31 9.11 46.92a1 .99 35.5 01-1.62.27z"},{"z":"base","d":"M345.77 316c-4.12-1.96-12.78-6.76-15.07-11.38-4.29-8.65-2.69-16.02-2.28-25.25a1 1 0 011.95-.28c4.29 12.42 10.5 24.4 15.71 36.61q.23.55-.31.3z"},{"z":"base","d":"M372.75 314.71c-5.78-9.67 1.71-31.17 6.17-40.68 5.95-12.68 8.21-24.68 18.35-33.9a.49.49 0 01.82.35c.28 8.68.84 19.39-1.97 27.72-5.26 15.58-11.39 33.46-21.42 46.62a1.18 1.18 0 01-1.95-.11z"},{"z":"base","d":"M398.01 278.49a.5.49 35.5 01.87-.14c2.01 2.7 1.62 11.6 1.61 15.13-.04 12.42-8.2 17.45-17.9 22.58a.35.35 0 01-.48-.46c5.51-12.02 11.85-24.46 15.9-37.11z"},{"z":"back","d":"M285.01 307.01a.89.89 0 01-.11-1.64q19.44-9.61 35.65-24.8 1.68-1.57 3.31-.31.4.32.45.82 1.25 12.61-1.57 25.41c-.74 3.32-2.55 4.23-5.9 4.48q-16.02 1.24-31.83-3.96z"},{"z":"back","d":"M414 311.19c-5.24-.12-7.81-.64-8.9-6.27q-2.33-12.09-1.17-23.94.06-.61.61-.89 1.66-.85 3.65.99 16.12 14.87 33.97 23.63 3.65 1.79-.27 2.89-13.88 3.91-27.89 3.59z"},{"z":"shoulders","d":"M274.06 311.69q3.94 2.77 4.33 8.14.04.48-.38.73c-9.98 5.88-24.35 7.45-28.82 19.75-2.31 6.36-.97 17.35-1.43 23.68q-.55 7.51-5.73 14.07-10.37 13.11-13.81 16.67c-3.41 3.53-6.81 1.76-10.69-.47-15.42-8.87-24.95-25.45-22.52-43.22 2.05-14.92 12.71-25.79 24.06-35.02 16.99-13.82 35.58-17.99 54.99-4.33z"},{"z":"shoulders","d":"M450.39 320.75q-.95-.52-.7-1.58c1.57-6.61 5.8-9.1 12.14-11.9 24.99-11.03 43.76 3.33 60.17 20.74 20.73 21.99 11.81 56.44-14.82 68.19-4.41 1.94-6.79-1.03-9.81-4.51-5.81-6.7-13.46-14.12-15.99-22.8-3.93-13.43 4.32-27.54-9.64-37.62q-8.22-5.93-17.99-9.08-1.84-.59-3.36-1.44z"},{"z":"quads","d":"M280.26 647.4c11.65 10.74 22.18 21.04 31.02 34.3 15.82 23.72 27.55 49.72 34.01 77.58 1.34 5.79-6.14 20.34-12.62 20.22q-.52-.01-.72-.49-.67-1.59-1.21-3.13c-14.68-41.71-27.96-79.71-46.87-117.01-1.9-3.74-3.05-7.33-4.06-11.2a.27.27 0 01.45-.27z"},{"z":"quads","d":"M331.64 898.32q-.17.57-.23-.02c-2.23-25.01-8.47-50.09-14.25-74.53q-19.4-82.1-42.46-163.69-.58-2.08.33-.13c19.88 42.53 38.94 86.51 51.64 132.07 9.49 34.06 15.59 71.67 4.97 106.3z"},{"z":"quads","d":"M334.46 789.17c1.56-2.63 14.39-20.38 16.2-20.37a1.71 1.7-89.2 011.7 1.76q-1.12 34.88-7.4 68.95c-.38 2.06-1.41 4.27-2.16 6.23q-.24.62-.34-.04-3.68-25.45-8.44-50.7c-.34-1.79-.63-4 .44-5.83z"},{"z":"quads","d":"M395.47 779.4c-5.7 1.33-11.34-11.87-12.46-15.86q-.61-2.18-.02-4.65 10.17-42.64 35.06-78.81c9.47-13.77 18.83-22.36 29.85-32.56q.55-.5.4.22-1.12 5.7-3.73 10.83c-19.44 38.38-33.3 79.2-47.77 119.65a1.84 1.83-86.4 01-1.33 1.18z"},{"z":"quads","d":"M453.65 658.99q.67-1.43.23.09-26.73 93.75-48.63 189.74c-1.98 8.7-3.66 17.9-5.44 26.84q-2.19 11.05-2.78 22.43a.15.15 0 01-.3.04c-8.18-24.48-6.74-51.98-1.87-76.86 11.07-56.49 34.44-110.42 58.79-162.28z"},{"z":"quads","d":"M377.91 768.67c1.49.84 1.76 1.49 2.66 2.66q6.16 8.04 12.23 16.13c1.88 2.52 1.97 4.18 1.38 7.45q-4.57 25.23-8.43 50.57-.11.71-.4.05-1.89-4.29-2.54-8.09-5.57-32.28-6.98-65.01-.09-2 .81-3.44a.95.94 30.8 011.27-.32z"},{"z":"quads","d":"M292.42 935.6q-.95-.52-1.57-1.4-4.1-5.79-7-13.53-7.8-20.79-13.3-42.33c-9.06-35.53-19.33-71.36-25.03-107.59-5.33-33.86 4-74.19 20.7-103.37q.35-.62.53.07c14.44 55.57 39.03 107.94 41.45 165.34 1.11 26.34.66 52.96-3.6 79.03-.63 3.83-4.73 27.81-12.18 23.78z"},{"z":"quads","d":"M275.11 942.93q-2.42-2.18-3.57-5.24c-3.98-10.61-7.68-21.02-12.81-31.32-7.85-15.76-10.77-34.56-13.2-51.46-2.11-14.63-2.31-31.47-3.93-47.18-.22-2.16-1.04-12.78.46-13.79q1.36-.92 2.08.55c1.5 3.08 3.12 6.12 3.66 9.58q8.21 52.38 26.36 102.15c2.87 7.87 9.98 30.5 1.85 36.74a.71.7-42.5 01-.9-.03z"},{"z":"quads","d":"M322.69 945.72c-3.73 6.14-10.77-2.43-12.6-5.6-3.16-5.47-2.62-14.93-1.78-20.81 4.03-28.09 5.6-52.81 3.48-80.78q-.06-.79.28-.08 15.77 32.83 14.26 68.9c-.4 9.54-2.94 22.48-2.91 34.13q.01 3.02-.73 4.24z"},{"z":"quads","d":"M437.82 933.52c-8.9 14.18-15.15-26.74-15.46-29.25q-5.26-43.04-1.19-86.08c4.9-51.8 26.91-99.32 40.38-150.92q.18-.66.5-.06c17.25 31.67 25.39 68.28 20.54 104.36q-2.29 17.02-8.71 42.76-7.56 30.25-15.2 60.47-6.13 24.25-15.06 47.61-1.83 4.79-5.8 11.11z"},{"z":"quads","d":"M451.79 942.6c-9.95-10.01 4.97-42.91 8.94-55.41q12.55-39.53 19.27-80.47c.49-2.97 2.64-12.34 5.41-13.28a.83.83 0 011.09.64q.74 4 .45 7.92c-1.99 26.52-3.37 58.99-11.01 87.73q-2.53 9.5-7.46 18.8c-4.38 8.24-6.97 16.72-10.08 25.27q-1.66 4.54-4.55 8.63a1.35 1.35 0 01-2.06.17z"},{"z":"quads","d":"M406.69 946.81c-3.24-2.77-1.48-10.64-2.01-14.71q-2.23-17.18-2.57-22.16c-1.75-25.07 3.61-49.11 13.98-71.92q.23-.51.2.05c-1.2 19.15-1.28 38.18.83 57.38q1.68 15.4 3.39 30.8c.43 3.92-.31 9.71-2.09 13.33-1.62 3.28-7.58 10.77-11.73 7.23z"},{"z":"base","d":"M297.69 1008.37c-7.27 7.29-16.34 3.42-19.64-5.18q-6.18-16.11-9.57-30.68c-1.99-8.6-2.24-19.68 9.72-19.91q13.12-.24 26.05 2.15 1.71.32 3.29 1.02a1.17 1.15 4.2 01.63.72c3.17 10.27 2.5 23.36.05 33.69q-2.37 10.01-10.53 18.19z"},{"z":"base","d":"M288.03 1059.54c-6.99-5.81 13.75-46.43 17.3-53.91q7.3-15.38 10.9-32.01c.74-3.42 2-6.31 4.18-8.64a1.36 1.35 54.7 012.23.39c3.97 9.09 1.66 13.86-1.67 24.65q-10.23 33.19-27.2 63.57-1.8 3.23-4.2 5.84a1.13 1.12-49 01-1.54.11z"},{"z":"base","d":"M430.44 1008.31c-12.92-12.62-14.34-33.49-10.92-50.31.31-1.53 1.09-2.53 2.73-2.86q11.44-2.25 23.08-2.59c14.13-.42 17.31 5.67 14.54 18.63q-3.13 14.69-9.12 30.37c-3.45 9.03-11.63 15.25-20.31 6.76z"},{"z":"base","d":"M438.96 1059.52q-2.25-1.89-3.8-4.64-20.15-35.92-31.06-75.66-2.11-7.68 1.95-14.16a1.16 1.16 0 011.91-.08c2.26 3.06 3.4 5.4 4.26 9.37 3.98 18.54 10.94 32.53 20.07 51.09 3.51 7.14 11.38 26.16 8.5 33.61a1.16 1.16 0 01-1.83.47z"},{"z":"calves","d":"M263.52 973.59a.6.6 0 011.09-.14q1.38 2.22 1.83 5.06c7.87 49.97 18.01 99.59 25 149.68q4.63 33.19 4.31 67.55-.04 3.45-2.15 5.76-.4.44-.75-.03-1.89-2.58-3.08-5.51c-11.63-28.6-20.46-58.12-24.26-88.68q-4.96-39.97-5.72-69.53c-.13-5.27-.17-12.59.35-18.98q1.7-20.77 2.52-41.6c.04-1.16.52-2.43.86-3.58z"},{"z":"calves","d":"M463.39 973.68a.7.7 0 011.25-.1c.27.46.64 1.34.68 1.93q1.26 20.88 2.53 41.76.66 10.82.39 19.98-1.23 40.77-7.51 82.25c-3.91 25.87-12.19 51.55-21.96 75.76q-1.13 2.79-3.27 6.13-.29.44-.71.12c-2.68-2.06-2.32-6.7-2.29-10.32.26-31.03 2.71-55.52 8.76-91.4q9.27-55.06 18.94-110.05c.8-4.5.99-10.52 3.19-16.06z"},{"z":"calves","d":"M252.09 1032.57c.24-3.71 2.14-22.17 4.63-24.18a1.03 1.02-17.9 011.67.85c-.45 7.89-1.27 16-1.49 23.45q-.57 18.93-.66 37.88-.02 3.63.34 6.85c2.08 18.76 5.56 37.32 9.3 55.8 3.82 18.84 9.13 37.64 13.11 56.63q2.44 11.68 2.08 17.95c-.32 5.7-3.08 20.49-8.51 23.92a.62.62 0 01-.84-.16q-1.2-1.65-.95-3.55c.92-7.26 1.45-14.15-.3-21.52q-8.25-34.74-13.62-59.06c-1.86-8.44-3.17-17.18-3.93-26.3q-3.69-44.24-.83-88.56z"},{"z":"calves","d":"M315.01 1025.17a.16.16 0 01.32.02c4.06 25.75 8.98 52.72 8.71 77.81q-.13 12.06-5.74 26.31c-7.2 18.3-8.93 38.57-15.95 56.93q-.18.48-.21-.03c-1.87-34.47-5.67-65.91-8.56-103.28q-.97-12.49 4.44-23.14 7.47-14.69 15.14-29.29c.81-1.55 1.35-3.62 1.85-5.33z"},{"z":"calves","d":"M455.5 1231.67c-7.13-5.81-9.23-24.34-8.2-31.86 1.41-10.32 4.63-23.14 7.98-36.33q9.54-37.46 15.15-75.74c2.86-19.5 1.53-40.15.75-59.8-.22-5.67-.98-12.51-1.23-18.75a.97.97 0 011.87-.4c.35.86.92 1.76 1.12 2.68q2.96 14.31 3.31 20.53 2.37 43.28-.49 84.75-1.21 17.42-5.43 35.77-6.33 27.51-12.84 54.98-2.01 8.49-.11 18.36c.36 1.9.11 3.95-.68 5.55a.79.79 0 01-1.2.26z"},{"z":"calves","d":"M412.77 1025.44a.14.14 0 01.27-.04c4.88 11.62 10.93 22.01 17.28 34.78 4.07 8.19 4.71 14.41 4.1 24.25-2.13 34.3-6.27 68.85-8.45 101.59q-.05.69-.31.05-1.48-3.67-2.28-6.75c-4.34-16.75-8.78-38.38-16.39-57.57q-1.4-3.55-2.2-10.11c-1.78-14.73-.2-31.24 2.04-45.88q3.06-20.02 5.94-40.32z"},{"z":"forearms","d":"M127.23 683.05c-4.07-2.12 1.27-27.07 2.25-31.57 4.98-23.03 9.17-46.17 13.91-69.25q1.53-7.47 2.13-15.13c.93-12.09.81-22.15 6.23-31.59 7.1-12.33 13.54-29.16 26.1-36.73a1.98 1.97 62.7 012.84.91c1.92 4.48 1.93 8.28 2.06 14.15.44 19.77-1.3 41.04-8.72 59.67-11 27.62-22.22 55.21-32.62 82.91-4.04 10.76-7.56 20.66-12.82 26.39q-.59.65-1.36.24z"},{"z":"forearms","d":"M201.5 527.4a.84.84 0 01.67.65c3.98 17.15-2.93 39.36-10.95 54.41-4.6 8.63-13.06 20.43-18.21 31.33q-13.21 27.92-24.58 56.64-2.51 6.35-6.61 11.02a1.43 1.43 0 01-2.5-.81q-.36-3.78.84-7.17 10.31-29.18 21.57-57.99c6.32-16.18 14.55-31.65 20.66-47.87 3.69-9.82 5.36-22.36 7.32-30.62 1.49-6.27 4.19-11.06 11.79-9.59z"},{"z":"forearms","d":"M207.33 540.4a.6.59-63.1 011.03-.34l5.38 6.02q.4.45.33 1.06-.52 4.1-1.29 5.84-6.91 15.65-13.69 31.35c-5.41 12.53-16.33 28.4-23.51 44.89-8.3 19.08-16.03 39.32-26.75 57.16a.36.36 0 01-.62 0l-.19-.32q-.17-.28-.06-.59 10.08-29.91 23.05-58.65 2.9-6.42 5.47-11.21c4.62-8.59 10.86-16.17 14.62-23.02q13.23-24.13 16.23-52.19z"},{"z":"forearms","d":"M600.08 683.04c-5-4.14-8.97-15.46-11.29-21.56-5.82-15.25-11.38-30.55-17.58-45.7q-9.15-22.39-18.02-44.89c-5.58-14.19-7.32-31.42-7.99-46.57-.29-6.44-.68-19.43 2.67-25.02a1.71 1.71 0 012.25-.63c6.72 3.52 11.29 9.96 14.87 16.5q6.25 11.38 12.68 22.66c1.97 3.45 2.93 7.66 3.41 12.06 1.16 10.6 1.55 21.29 3.66 31.65 3.93 19.29 7.38 38.63 11.47 57.92 1.5 7.07 9.3 39.08 5.12 43.5a.91.91 0 01-1.25.08z"},{"z":"forearms","d":"M586.58 681.46q-4.35-4.47-6.75-10.61-11.35-28.91-24.59-57.01c-5.72-12.13-14.32-22.86-19.97-35.1-7.1-15.36-12.9-33.32-9.27-50.31a1.44 1.43-87.1 011.23-1.12c7.47-.88 9.29 2.88 11.02 9.2 3.39 12.42 4.76 25.91 9.75 36.7 15.55 33.65 27.61 64.94 39.31 98.42 1.13 3.24 2.05 5.47 1.62 9.04a1.38 1.37 26.3 01-2.35.79z"},{"z":"forearms","d":"M579.58 686.43q-3.92-5.77-6.87-12.13-8.05-17.34-19.75-44.5-2.68-6.24-6.46-13.62c-5.14-10.05-13.15-22.36-17.34-31.85q-9.55-21.68-13.66-31.36-1.09-2.58-1.33-5.87-.04-.61.37-1.07l5.24-5.85a.69.69 0 011.2.4q2.74 27.05 15.49 50.75 1.7 3.17 8.26 12.86 7.02 10.39 12.18 21.88 8.71 19.41 20.19 50.1 2.22 5.92 3.13 9.98a.36.36 0 01-.65.28z"},{"z":"base","d":"M100.98 745.85c-9.03-6.62-15.78-13.18-13.3-24.59 2.67-12.29 15.01-20.6 25.37-26.21 7.76-4.21 18.22-1.68 26.15.97 7.14 2.39 11.11 6.16 11.1 13.86q-.04 18.51-4.75 36.37c-5.47 20.76-34.48 6.99-44.57-.4z"},{"z":"base","d":"M53.81 746.32a.91.91 0 01-.74-.95c.14-2.49-.23-6.34 2.25-7.8 4.66-2.71 11.37-5.53 14.15-10.3q6.32-10.86 16.56-20.3 1.27-1.17.64.44c-1.45 3.73-2.86 7.21-3.87 11.59-2.76 11.9-14.62 30-28.99 27.32z"},{"z":"base","d":"M87.21 745.05c1.44.46 8.14 2.66 8.61 4.55 1.26 5.12-4.42 8.54-7 12.25-7.73 11.1-15.12 23.38-24.25 33.28a1.22 1.22 0 01-2.11-.86c.11-3.93.38-7.1 2.43-10.65q10.27-17.71 19.31-36.11.32-.65 2.13-2.27.38-.35.88-.19z"},{"z":"base","d":"M108.11 758.12a2.16 2.16 0 011.07 2.87q-10.49 22.55-19.92 45.81c-1.45 3.56-4.37 5.15-7.82 6.04a1.35 1.34-8.1 01-1.69-1.26c-.11-3.05.37-5.87 1.58-8.9q8.1-20.28 15.15-40.96c.41-1.2.62-3.33 1.69-4.85a1.21 1.21 0 01.91-.49q4.72-.21 9.03 1.74z"},{"z":"base","d":"M134.09 799.9q-1.16-1.7-1.41-3.73-2.1-17.07-1.18-34.29.03-.6.61-.75l6.93-1.85q.68-.19.65.52-.51 10.9-.85 21.71c-.28 8.58.1 12.65-4.17 18.4a.36.36 0 01-.58-.01z"},{"z":"base","d":"M108.13 814.65a1.48 1.48 0 01-1.62-1.47c-.02-2.83-.14-5.66.32-8.53q2.9-17.79 5.4-35.65.53-3.84 1.58-7.56a.66.66 0 01.76-.48l7.26 1.24a.97.97 0 01.78 1.14q-4.76 23.96-9.1 46.26-.9 4.64-5.38 5.05z"},{"z":"base","d":"M591.31 755.99c-8.06-2.93-8.66-9.76-10.28-17.06q-3.22-14.42-3.1-29.3.04-4.06 1.46-6.55c4.34-7.57 18.16-9.91 25.63-10.35 8.75-.51 18.37 6.96 24.99 12.27q8.92 7.17 10.74 17.52c2.45 13.89-12.11 23.41-22.7 29.04-6.95 3.69-18.63 7.39-26.74 4.43z"},{"z":"base","d":"M641.97 706.78q10.85 9.65 17.61 21.91c1.63 2.97 9.74 6.76 12.87 8.59 2.9 1.7 3.03 4.81 2.55 8.5q-.06.42-.48.49c-8.16 1.32-11.99-1.93-17.72-7.23-10.35-9.58-10.5-20.33-15.33-31.9q-.54-1.29.5-.36z"},{"z":"base","d":"M638 760.07c-2.54-3.42-7.52-6.03-5.44-11.11q.18-.44.61-.63l7.41-3.3q1.29-.58 2.05.62 3.33 5.23 5.69 10.04 6.84 13.94 14.71 27.33c1.35 2.29 4.28 10.16 2.25 12.11a1.22 1.22 0 01-1.77-.08c-9.43-10.98-16.85-23.36-25.51-34.98z"},{"z":"base","d":"M647.83 812.68c-4 .24-7.71-2.87-9.11-6.38q-9.28-23.27-19.74-45.33a2.05 2.05 0 01.92-2.71q4.5-2.28 9.62-1.7a1.09 1.07 83.8 01.89.73q7.5 23.06 16.57 45.5 1.8 4.46 1.5 9.24a.7.7 0 01-.65.65z"},{"z":"base","d":"M596.17 761.18a.84.84 0 01.62.81c-.01 4.86.95 35.3-2.71 37.67q-.49.32-.82-.17-3.41-5.21-3.51-8.49-.45-15.62-1.16-31.23-.03-.72.66-.52l6.92 1.93z"},{"z":"base","d":"M621.09 814.28c-4.35 1.91-5.92-3.77-6.5-6.56q-4.52-21.91-8.88-43.95a1.41 1.41 0 011.14-1.66l6.8-1.18a.92.92 0 011.06.76q2.79 16.32 5.09 32.91c.85 6.17 2.2 12.25 1.8 18.95q-.03.52-.51.73z"},{"z":"base","d":"M291.88 1208.11c5.48-1.03 11.85 5.55 13.38 10.37q2.45 7.74 1.47 16.83-.09.83-.45.08c-4.31-9.05-8-16.99-15.39-23.88a1.98 1.98 0 01.99-3.4z"},{"z":"base","d":"M275.88 1270.94c-4.41-3.87-7.4-7.17-4.91-13.37q4.78-11.92 5.49-21.32.62-8.27 6.22-12.84c9-7.33 20.8 15 23.1 22.1 2.55 7.91 4.83 16.36 4.49 24.5-.31 7.14-2.02 17.4-6.49 23.1q-.3.38-.53-.05c-5.67-10.74-18.6-14.41-27.37-22.12z"},{"z":"base","d":"M430.92 1209.12c2.24-1.35 10.54-2.02 6.02 2.65q-9.99 10.32-14.82 23.8a.28.28 0 01-.55-.08c-.52-10.27-.48-20.45 9.35-26.37z"},{"z":"base","d":"M445.01 1223.26c8.45 6.56 6.46 16.66 9.35 25.59q1.76 5.43 3.47 10.88c3.84 12.26-27.75 21.49-32.21 32.42q-1.02 2.51-2.17.05c-6.91-14.82-6.79-29.36-1.78-44.58q2.82-8.57 8.02-16.04c3.02-4.35 9.61-12.76 15.32-8.32z"},{"z":"base","d":"M264.5 1334.5c-3.98-.34-18.59-4.25-19.04-9.44a1.4 1.4 0 01.27-.94c9.66-13.03 20.9-25.49 28.65-39.78q.25-.47.78-.37 9.76 1.78 17.73 7.65a1.19 1.18 43 01.07 1.86c-1.32 1.11-1.65 2.62-1.06 4.35 2.96 8.57-.92 16.55-4.81 25.34-1.79 4.06-1.76 8.99-2.81 13.62a1.56 1.56 0 01-1.99 1.14q-8.36-2.64-17.79-3.43z"},{"z":"base","d":"M291.87 1340.12c-2.25-2.64-2.07-5.93-.78-9.35q3.34-8.88 4.02-18.35.43-6.02 1.25-8.74 1.32-4.37 3.45-8.22a.66.65 53.7 011.21.19q1.97 9.26 6.28 17.3c2.59 4.85-.82 11.49-2.92 16.14a1.81 1.78-35.8 00-.16.94q.42 4.3-1.9 7.94-.22.33-.61.43l-8.79 2.06a1.06 1.06 0 01-1.05-.34z"},{"z":"base","d":"M444.66 1337.65q-1.08-1.3-1.28-3.09c-.52-4.48-.73-8.39-2.77-12.64-3.51-7.31-7.06-16.37-4.43-23.19.77-1.99.92-3.79-.76-5.13a1.29 1.28 46.4 01.04-2.04q7.96-5.76 17.59-7.64.46-.1.69.32c7.25 13.1 17.21 24.83 26.45 36.56q1.11 1.41 2.51 3.8a1.17 1.14-51 01.09.95c-1.75 5.01-12.93 7.89-17.77 8.55q-9.87 1.36-19.54 3.82a.82.8-26.2 01-.82-.27z"},{"z":"base","d":"M426.94 1338.55c-2.01-.34-2.96-5.48-3-7.12-.15-6.02-6.29-11.65-3.12-17.89q4.35-8.53 6.34-17.75a.78.78 0 011.47-.17c2.12 4.52 4.18 9.08 4.35 14.33q.35 10.43 3.97 20.24c1.19 3.22 1.52 5.83.39 8.78a2.32 2.31 19.3 01-2.87 1.38q-3.44-1.09-7.53-1.8z"},{"z":"base","d":"M 418.91 167.68 c 3.92 -1.77 6.58 0.47 7.06 4.32 c 1.48 11.93 -4.92 26.67 -11.75 36.45 c -2.21 3.17 -3.86 0.17 -4.74 -1.76 a 0.38 0.38 0 0 0 -0.73 0.16 c 0.02 8.31 1.01 17.01 -3.36 24.53 c -0.167 0.293 -4.39 4.62 -10.799 9.508 c -23.591 18.112 -41.591 16.112 -61.446 -0.797 c -4.736 -3.649 -5.925 -5.041 -8.805 -7.621 c -5.66 -5.07 -5.28 -17.38 -4.47 -24.92 c 0.05 -0.51 -0.468 -0.892 -0.933 -0.687 a 0.653 0.653 0 0 0 -0.357 0.397 c -0.57 1.69 -2.24 4.05 -4.07 1.48 c -6.2 -8.71 -16.02 -28.53 -11.19 -38.98 c 1.68 -3.627 3.733 -3.91 6.16 -0.85 a 182.853 182.853 0 0 1 3.78 23.29 a 1.02 1.02 0 0 0 1.56 0.77 c 2.79 -1.75 2.61 -18.93 2.63 -24.22 c 0.02 -4.53 1.12 -8.94 3.8 -13.1 c 4.36 -6.76 4.86 -11.51 5.57 -19.82 c 0.47 -5.53 4.34 -8.12 9.77 -8.21 c 6.39 -0.12 12.69 -0.07 19 -0.93 c 4.02 -0.55 7.4 -1.43 11.53 -0.75 c 6.7 1.1 13.44 1.64 20.22 1.62 c 4.607 -0.013 7.523 0.227 8.75 0.72 c 5.96 2.37 5.56 9.73 6.11 15.22 c 0.44 4.34 2.097 8.447 4.97 12.32 c 6.57 8.88 2.19 25.6 5.64 36.36 a 1.14 1.14 0 0 0 2.22 -0.23 c 0.887 -8.36 2.18 -16.45 3.88 -24.27 z z z z"},{"z":"base","d":"M418.91 167.68q-2.55 11.73-3.88 24.27a1.14 1.14 0 01-2.22.23c-3.45-10.76.93-27.48-5.64-36.36q-4.31-5.81-4.97-12.32c-.55-5.49-.15-12.85-6.11-15.22q-1.84-.74-8.75-.72-10.17.03-20.22-1.62c-4.13-.68-7.51.2-11.53.75-6.31.86-12.61.81-19 .93-5.43.09-9.3 2.68-9.77 8.21-.71 8.31-1.21 13.06-5.57 19.82-2.68 4.16-3.78 8.57-3.8 13.1-.02 5.29.16 22.47-2.63 24.22a1.02 1.02 0 01-1.56-.77q-1.14-11.78-3.78-23.29-1.48-6.99-1.9-9.7c-2.49-15.94.13-40.13 13.53-51.15 9.39-7.72 28.53-11.63 40.37-11.51 4.2.05 8.74-.3 12.68.22 13.82 1.82 31.67 5.83 39.42 18.92 9.01 15.21 9.88 35.14 5.33 51.99z"}],"maleBack":[{"z":"base","d":"M1022.74 290.63a.62.61 25.9 01-.36-1.03q1.71-1.83 4.11-3.11c8.19-4.35 19.4-8.3 23.38-17.48q8.48-19.57 8.22-40.85-.05-4.38.57-5.76c1.98-4.38 9.65-3.66 13.85-2.91 4.3.76 4.71 3.25 4.68 7.3q-.2 24.11-.88 48.2c-.12 4.25 1.6 15.84-4.88 16.32-14.57 1.08-32.6 1.81-48.69-.68z"},{"z":"base","d":"M1095.75 291.46c-4.3-.25-4.9-3.99-4.95-7.71q-.46-29.47-1-58.94c-.13-7.39 11.74-6.23 15.99-4.85 4.2 1.36 3.01 6.89 2.88 10.79-.28 8.88 5.15 41.1 15.32 46.78q8.6 4.81 17.27 9.51 1.97 1.07 3.26 2.36a.8.79 63.6 01-.45 1.35c-16.12 2.17-33.78 1.56-48.32.71z"},{"z":"back","d":"M1071.06 308.94c5.6 4.92 6.96 17.83 7.43 24.88q1.5 22.3.93 44.68-1.2 46.76-5.66 94a.57.56 3.7 01-.59.51q-.68-.03-.94-1.01-4.29-15.9-9.79-25.19c-10.24-17.31-18.8-31.84-25.59-49.4-10.19-26.38-15.6-54.28-26.46-80.58q-3.07-7.43-7.61-14.07-.3-.43.2-.6 12.47-4.28 25.48-4.85c5.54-.25 12.15.86 18.32 1.41 9.7.87 16.77 3.6 24.28 10.22z"},{"z":"back","d":"M1163.98 302.12a.43.43 0 01.22.65q-7.08 10.77-11.41 23.37c-10.53 30.61-17.8 62.94-31.3 91.07-5.11 10.64-15.17 25.22-20.12 36.26q-4.08 9.08-6.59 18.83a.77.77 0 01-1.51-.12q-4.27-45.15-5.52-90.99c-.56-20.28-.74-39.92 2.75-60.43 1.04-6.13 2.77-9.98 7.85-13.85 9.8-7.48 18.02-7.73 30.1-9.11 12.02-1.39 23.92.4 35.53 4.32z"},{"z":"shoulders","d":"M980.66 319.58c.19.14.55.19.65.32a.8.8 0 01-.16 1.15c-6.78 4.75-15.26 9.77-20.03 15.58-6.41 7.78-8.76 16.96-9.44 27.04-.39 5.92-1.68 9.5-5.59 13.43-10.02 10.08-19.04 16.47-31.14 20.41q-.75.25-.75-.55.19-18.4-.09-36.3-.14-9.4 1.07-14.22c4.04-16.07 22.8-33.85 39.68-35.64 9.99-1.06 17.34 2.46 25.8 8.78z"},{"z":"shoulders","d":"M1227.3 316.44c14.62 9.44 25.48 21.03 25.46 39.51q-.02 20.56-.01 41.37a.37.37 0 01-.51.35c-5.08-2.06-10.41-3.98-14.9-6.97-7.84-5.24-21.14-14.95-21.77-24.95-.69-10.75-2.81-20.85-9.76-29.25-4.68-5.65-12.96-10.58-19.6-15.26q-1.23-.87.01-1.71c4.6-3.13 9.91-6.78 15.25-7.98q13.58-3.03 25.83 4.89z"},{"z":"back","d":"M987.06 381.44c-8.48-5.06-14.14-13.28-18.82-22.92q-5.3-10.92-6.46-14.04c-1.49-4.01 35.14-19.22 39.61-20.97q2.75-1.08 4.33-.72c4.33.96 6.61 9.96 7.46 13.7q5.43 23.89 14.65 55.74.78 2.7-.88 4.39c-5.37 5.5-34.69-12.08-39.89-15.18z"},{"z":"back","d":"M1017.44 583.31q-9.11-9.57-16.97-22.03-2.28-3.62-2.91-7.25c-3.28-18.82-5.77-38.04-10.52-56.55-3.53-13.73-4.74-25.19-6.61-41.43-.85-7.35-5.67-13.34-8.22-18.75q-4.93-10.47-6.44-22.88-.33-2.72 1.89-1.11c7.25 5.27 16.36 6.16 26.91 7.56 8.86 1.19 23.41-3.18 28.94-10.76 3.34-4.58 4.7-6.5 8.86-8.77a.67.66-26.4 01.92.3q10.02 21.8 19.93 43.78c2.56 5.69 12.11 15.88 10.77 21.83-3.65 16.09-9.88 31.96-16.24 47.13-9.72 23.21-18.61 46.72-27.2 70.36q-.24.67-.88.35-1.03-.52-2.23-1.78z"},{"z":"back","d":"M1017.71 404.73c-23.86 13.25-54.31 7.11-60.45-22.75-1.2-5.81-2.5-15.84.64-20.55 3.63-5.44 7.17 4.18 8.17 6.14 7.71 15.14 31.62 29.16 48.2 31.13q1.84.21 5.26 2.06.4.21.26.64-.86 2.65-2.08 3.33z"},{"z":"back","d":"M1141.45 397.63a2.17 2.14-3.6 01-1.88-1.64q-.71-2.97.18-5.95 8.74-29.19 11.75-43.29c1.73-8.11 3.07-16.77 6.94-22.08 1.92-2.62 4.28-2.27 7.19-1.15q20.52 7.9 39.09 18.77a1.37 1.36 25.9 01.58 1.67c-6.05 15.46-12.98 30.84-28.43 39.45-9.45 5.26-25.83 15.17-35.42 14.22z"},{"z":"back","d":"M1149.69 404.8q-2.04-1.15-2.45-3.5-.09-.53.41-.75c4.64-2.04 9.78-2.51 14.63-3.87 11.01-3.1 22.03-10.83 30.34-18.57q6.33-5.89 7.58-8.93c1.02-2.49 3.79-9.5 7-9.46q.52.01.87.39 2.71 3.01 2.81 7.2c.33 13.77-2.24 26.93-13.26 35.95-13.88 11.36-33.12 9.94-47.93 1.54z"},{"z":"back","d":"M1161.19 419.98c6.1 1.57 11.6.99 17.75.06 8.36-1.27 14.83-2.76 21.34-7.27a.54.53 74.1 01.84.47q-.64 11.88-5.76 22.85c-2.42 5.2-6.64 10.84-8.04 16.67q-1.02 4.24-1.43 8.92-1.64 18.72-6.34 37.47c-4.73 18.91-7.13 38.67-10.8 57.85q-.24 1.24-2.2 4.3c-4.57 7.14-12.22 19.43-19.34 23.88a.44.43-25.6 01-.64-.22c-8.26-22.57-16.6-45.11-25.91-67.23-6.67-15.85-13.27-32.14-17.27-48.42q-1.58-6.41 2.91-12.01 5.21-6.51 8.57-14.14 9.25-21 19.01-41.64a.47.47 0 01.65-.21q6.17 3.37 9.51 9.64c2.45 4.6 12.22 7.75 17.15 9.03z"},{"z":"triceps","d":"M931.03 442.29c-2.01 2.57-6.52 9.71-10.12 9.17q-.52-.08-.8-.52-1.35-2.09-1.84-4.44c-2.25-10.87-3.28-22.88 1.35-33.38 5.45-12.33 18.27-23.68 29.61-31.2a.47.46 68.7 01.71.32l6.42 38.52q.09.54-.26.97c-.47.58-1.12 1.52-1.71 1.94q-9.11 6.58-18.08 13.36-2.9 2.2-5.28 5.26z"},{"z":"triceps","d":"M958.15 427.11a.41.41 0 01.55.27q4.44 16.16-2.23 31.41-3.37 7.73-5.91 19.98c-1.51 7.28-8.93 12.21-11.81 18.82-2.42 5.56-2.41 12.5-3.51 16.66-2.14 8.06-8.51 14.15-13.91 20.13a.93.93 0 01-1.54-.25q-.57-1.3-.75-2.89c-1.93-16.91 2.52-33.52 5.71-49.99 2.16-11.21-1.54-24.15 9.68-34.59q9.54-8.86 19.55-17.23c1.3-1.08 2.7-1.72 4.17-2.32z"},{"z":"triceps","d":"M903.57 519.67a1.84 1.82-5.4 01-1.12-.92q-3.54-6.97-3.68-15.19c-.37-21.2 3.8-42.53 9.5-63.44q.33-1.23.92-.1 4.64 8.78 8.6 18.67c2.88 7.21 4.19 12.98 1.88 20.57q-6.07 19.96-14.02 39.23-.65 1.58-2.08 1.18z"},{"z":"triceps","d":"M1213.94 424.56q-2.02-1.5-3.08-3.02-.31-.46-.22-1 3.32-19.22 6.42-38.46.09-.56.56-.25 14.9 9.82 24.8 22.71c9.8 12.75 9.72 30.37 5.41 45.13a2.62 2.62 0 01-3.76 1.57c-3.26-1.77-6.22-6.71-8.62-9.67-5.24-6.46-14.75-12-21.51-17.01z"},{"z":"triceps","d":"M1246.2 534.5q-.95-.3-1.75-1.22c-4.65-5.4-9.13-9.88-11.46-15.51-2.96-7.13-1.37-15.5-5.64-22.09-4.06-6.26-8.72-9.91-10.89-17.58-1.62-5.68-2.81-11.46-4.97-17.02-4.56-11.69-6.45-20.86-3.33-33.56a.59.58-74 01.75-.42q1.69.56 3.22 1.79 11.23 9.08 21.54 19.18c5.39 5.28 6.92 10.13 7.24 18.16.9 22.52 10.62 44.97 6.59 67.49a1.01 1 13.9 01-1.3.78z"},{"z":"triceps","d":"M1258.43 439.96q2.01 5.38 3.1 10.68c3.58 17.36 7.13 34.77 6.89 52.61q-.11 8.3-3.94 15.61a1.61 1.6 33.4 01-2.44.5c-1.45-1.19-1.9-3.58-2.43-4.94q-9.23-23.41-13.19-38.15c-2.63-9.81 6.82-27.63 11.53-36.35q.28-.5.48.04z"},{"z":"back","d":"M986.76 627.1c-3.13-13.13-7.31-49.77 7.27-58.07 2.4-1.37 4.8-.82 6.7 1.29 6.15 6.8 16.22 18.56 18.77 28.15a1.35 1.3 52.6 01-.11.98c-2.51 4.53-9.96 8.09-15.83 11.36q-5.47 3.06-11.33 10.52c-1.23 1.56-2.6 4.3-4.5 6.06a.59.58-28.2 01-.97-.29z"},{"z":"back","d":"M1023.15 607.96a2.06 2.04-74.3 01-.94-1.69c-.17-10.98 5.04-24.58 8.79-34.9q15.61-42.83 36-83.59a1.11 1.1-62.5 011.51-.48c1.25.66 3.21 12.98 3.46 15.08q6.94 59.25 2.82 116.88-.62 8.66-3.1 19.37-.13.53-.59.24l-47.95-30.91z"},{"z":"back","d":"M1090.76 581.75q.62-5.16 0-10.27.22-29.79 3.05-59.5 1.1-11.58 3.91-22.88.31-1.27.44-1.43 1.08-1.43 1.88.17 23.38 46.97 40.14 96.18c1.8 5.28 5.84 16.69 4.38 22.96a1.64 1.64 0 01-.71 1.01l-47.63 30.72q-1.12.72-1.34-.6-4.54-28-4.12-56.36z"},{"z":"back","d":"M1151.19 603.31q-5.39-3.38-2.19-9.05 8.03-14.22 17.88-24.62c3.49-3.69 9.04.89 10.97 3.99q2.92 4.66 3.8 10.14 3.5 21.77-1.21 43.02a.96.96 0 01-1.77.28c-6.92-11.85-16.03-16.56-27.48-23.76z"},{"z":"forearms","d":"M878.44 534.38a.15.15 0 01.18-.13c.47.12 6.68 15.77 7.07 17.22q6.66 24.73 5.52 50.29c-.4 8.9-3.45 17.35-6.64 25.55-7.94 20.38-17.41 41.88-29.59 60.09a1.04 1.02-54.2 01-1.49.25c-.34-.26.37-1.45.47-1.83q5.58-20.8 8.97-42.08 8.65-54.15 15.51-109.36z"},{"z":"forearms","d":"M893 518.93a.39.38 24.6 01.69-.25q5.97 7.83 13.11 15.27c8.08 8.4 1.41 28.73-5.88 37.12a1.05 1.05 0 01-1.63-.05c-6.09-7.93-5.41-18.74-4.97-28.44.36-8.12-.76-15.7-1.32-23.65z"},{"z":"forearms","d":"M869.06 547.19c2.16.36 1.67 6.21 1.57 7.8q-2.54 38.84-9.11 77.16c-3.04 17.71-8.47 41.3-22.09 54.09a.38.38 0 01-.62-.41c14.51-40.44 19-84.26 26.8-126.31q.9-4.88 1.48-10.82.18-1.81 1.97-1.51z"},{"z":"forearms","d":"M864.24 682.58q15.09-28.18 25.12-58.55c8.14-24.63 13.67-42.4 20.79-60.35q3.31-8.37 12.08-9.63c1.35-.2 3.68-.75 4.86.21q1.13.93.61 2.3-5.8 15.45-12.04 29.88c-5.79 13.39-14.92 28.68-20.32 40.14-6.12 13-28.07 59.18-31.64 56.64a.21.21 0 01.03-.36q.15-.07.34-.13.12-.04.17-.15z"},{"z":"forearms","d":"M1272.99 519.43c.27-.33.33-.75.75-1.05a.32.32 0 01.5.29c-.7 7.22-1.77 14.33-1.66 21.54.13 8.94 2.13 24-5.35 31.17q-.37.35-.73 0c-7.63-7.55-14.2-28.29-6.52-36.92q6.6-7.41 13.01-15.03z"},{"z":"forearms","d":"M1312.82 688.04c-4.78-6.01-7.2-10.8-11.76-19.56q-12.39-23.79-21.03-47.53c-4.86-13.36-5.22-26.17-3.83-40.19q1.13-11.5 2.69-19.53 2.72-13.98 9.59-26.79a.17.17 0 01.32.06q7.26 63.12 17.22 120.49 2.43 14.04 7.03 30.55c.22.79.74 1.33.36 2.4a.34.34 0 01-.59.1z"},{"z":"forearms","d":"M1296.52 558.51c-.22-2.94-1.44-10.25 2-12.04a.62.61-18.4 01.89.44q6.25 35.69 12.21 71.07c3.88 23 8.77 46.2 16.73 68.19a.29.29 0 01-.47.31c-11.67-10.67-18.09-31.15-20.89-45.98q-7.27-38.55-10.47-81.99z"},{"z":"forearms","d":"M1303.5 683.6c-2.89-.66-10.16-13.21-12.11-17.02-8.8-17.21-16.92-34.81-25.84-51.89-5.36-10.27-10.98-20.49-15.39-30.95q-5.86-13.86-11.07-27.8a1.63 1.62 79.5 011.5-2.2c13.02-.16 15.5 7.18 19.65 18.81q9.04 25.33 17.43 50.89 9.65 29.37 23.82 56.84.87 1.69 2.13 3.12.24.28-.12.2z"},{"z":"glutes","d":"M1045.06 626.19q1.42.61 4.11 4.4.27.39-.19.52c-14.47 4.12-26.13 7.4-38.13 15.77q-15.37 10.71-30.53 21.6a.55.54 74.9 01-.86-.5c1.19-13.13 10.35-35.23 20.46-45.06 9.14-8.88 34.99-1.11 45.14 3.27z"},{"z":"glutes","d":"M1007.94 762.81c-16.94-16.64-29.37-37.66-31.47-61-2.06-22.84 15.63-34.95 32.18-45.71 8.2-5.33 46.51-27.32 54.37-17.65 5.92 7.29 13.38 15.84 15.44 25.21q3.01 13.63 2.44 27.6-.94 22.59-6.27 44.49c-2.43 9.96-2.9 17.16-2.59 26.75.47 14.83-18.52 17.18-29.12 14.07-6.38-1.87-13.79-4.83-21.35-6.25q-7.39-1.38-13.63-7.51z"},{"z":"glutes","d":"M1117.94 631.04q-.13-.03-.27-.06-.12-.02-.06-.13 2.58-4.2 7.05-5.92 12.71-4.87 26.13-5.81c12.93-.91 17.1 3.08 23.28 13.06 5.71 9.22 13.32 24.7 13.44 36.06q.01.76-.61.32-16.65-11.74-33.2-23.51c-10.03-7.14-23.72-10.58-35.76-14.01z"},{"z":"glutes","d":"M1124.12 776.61c-9.28 2.74-26.75 1.29-28.86-10.88-1.05-6.03.27-14.88-1.3-23.27q-.54-2.94-2.15-9.35c-3.2-12.81-4.02-23.33-5.08-35.27-1.07-12.03-.57-22 1.64-33.17q1.1-5.6 4.19-10.41 8.74-13.58 11.87-16.59c4.96-4.77 15.84.18 21.19 2.11q19.7 7.12 40.17 21.43c9.59 6.7 19.29 14.31 22.93 25.17 4.81 14.37-.65 33.88-7.42 46.87q-7.79 14.97-21.39 28.9-6.74 6.9-15.26 8.36c-7.07 1.21-13.68 4.08-20.53 6.1z"},{"z":"quads","d":"M1070.06 785.19c2.95 1.36 1.8 10.43 1.49 13.04q-3.98 33.27-14.66 64.61a.39.39 0 01-.76-.17c.9-7.05 2.31-14.29 2.16-20.92q-.68-30.14-18.71-54.52-.29-.39.18-.49c7.42-1.52 23.53-4.69 30.3-1.55z"},{"z":"quads","d":"M1127.24 787.66c-15.99 21.49-22.3 48.51-16.08 74.83a.47.46-63.2 01-.88.29q-1.99-4.69-3.65-10.24-8.29-27.75-11.6-56.54c-.65-5.71-1.1-11.77 6.87-11.9q13-.19 25.68 2.83a.31.24 41.2 01.1.53q-.12.01-.27.07-.1.04-.17.13z"},{"z":"hamstrings","d":"M963.27 741.53a.71.7 31.7 011.19-.28q1.51 1.62 2.47 3.99c4.6 11.41 8.93 22.66 11.07 34.72 3.38 19.14 4.84 38.23 3.12 57.74q-1.68 19.06-2.99 38.15c-.51 7.55-.88 15.71.07 23.18q1.08 8.54 1.39 17.57a.52.52 0 01-.98.25q-1.03-2.07-1.8-4.62-5.13-16.92-7.25-34.49-5.01-41.45-6.86-83.17-1.09-24.75-.07-49.51.06-1.59.64-3.53z"},{"z":"hamstrings","d":"M1030.2 791.53q.17-.36.38-.03c5.26 8.11 9.94 16.15 12.47 25.64 3.12 11.72 5.87 24.36 4.31 36.24q-.5 3.8-3.57 14.02c-10.75 35.81-12.83 74.2-18.5 111.1q-.82 5.4-2.55 10.55-.23.68-.59.07c-4.72-8.07-5.18-25.09-5.34-34.81-.7-43.69 1.92-87.82 6.38-131.28 1.41-13.74 1.99-21.15 7.01-31.5z"},{"z":"hamstrings","d":"M998.81 761.94q14.07 14.17 20.1 33.62c.98 3.15-.78 9.61-.93 12.91q-1.3 27.63-2.3 55.27c-.55 15.31-1.54 30.27-5.12 45.26q-8.62 36.18-22.76 68.73-3.65 8.41-10.15 17.19-.45.61-.41-.14c.11-1.93.82-4.15.99-5.71q2.45-22.72 6.08-45.26c2.83-17.66 4.18-35.95 4.33-52.37.33-36.43-.75-73.34 1.47-109.68.33-5.32 1.07-16.16 4.7-20.25q.33-.36.81-.45 1.95-.37 3.19.88z"},{"z":"hamstrings","d":"M1052.52 855.62a.04.04 0 01.08.01q1.07 9.9 2.17 19.87.33 3.04-2.37 14.18c-3.83 15.8-8.15 31.11-8.9 47.47-.99 21.61-3.11 45.66-9.92 66.3q-1.49 4.52-.87-.2 3.38-25.36 3.7-51.99c.05-3.74-.4-10.32.2-15.58 2.19-19.2 7.39-38.25 11.75-57.05 1.78-7.64 2.93-15.21 4.16-23.01z"},{"z":"hamstrings","d":"M1183.25 947.53c2.57 14.85 4.32 31.11 6.22 46.14q.35 2.74-1.11.39c-14.67-23.67-23.34-52.15-30.55-79.32q-5.08-19.14-5.97-39.05-1.36-30.37-2.44-60.74c-.22-6.09-2.56-15.63-.55-21.57q5.87-17.35 18.96-31.07c10.77-11.28 10.17 46.55 10.16 48.97-.13 41.09-.45 74.18 1.91 110.07.57 8.75 1.88 17.53 3.37 26.18z"},{"z":"hamstrings","d":"M1136.43 791.52q.27-.42.49.03c3.12 6.46 4.84 12.26 5.68 19.83 5.07 45.8 8.05 94.61 7.56 140.76-.13 11.8-.46 26.22-5.13 37.08a.44.44 0 01-.83-.06q-2.51-9.14-3.69-18.41-3.54-27.64-7.36-55.24c-2.49-18-5.47-35.67-11.09-52.26q-4.35-12.82-2.08-26.75c1.76-10.77 3.58-21.61 8.46-31.16q3.58-6.99 7.99-13.82z"},{"z":"hamstrings","d":"M1115.03 856.73c2.03 18.72 7.11 37.44 11.47 55.77 2.25 9.46 3.94 19.51 3.95 30.11q.02 31.7 4.08 63.16.16 1.26-.29.07-2.7-7.15-4.19-14.6c-4.44-22.21-5.71-40.52-6.87-61.23-.24-4.24-1.19-9.64-2.23-13.92q-3.94-16.25-7.7-32.55c-2.09-9.04.08-18.69 1.6-27.66q.07-.38.32-.09.16.19.01.4-.19.24-.15.54z"},{"z":"hamstrings","d":"M1202.61 741.08a.44.44 0 01.72.03c.52.82.9 1.86.95 2.91q.73 15.98.37 31.97-1.16 52.95-7.85 105.49-1.88 14.74-5.97 29.04-1 3.52-1.92 4.95-1.57 2.47-1.39-.37c.58-9.44 1.83-19.17 1.71-28.16-.32-24.52-4.94-49.11-3.95-72.75.69-16.54 2.5-33.51 7.54-49.38q2.99-9.4 6.61-18.6.74-1.88 3.18-5.13z"},{"z":"calves","d":"M982.69 1149.31c-3.07-2.23-3.98-6.24-5.24-11.03-7.19-27.14-7.88-53.18-6.67-82.78q1.03-25.29 9.23-47.45c4.77-12.89 15.33-24.77 23.79-36q.82-1.09.74.27c-1.37 22.86-2.72 45.67-3.11 68.49-.52 30.56-1.51 61.11-.42 91.68.24 6.83-2.77 16.29-10.08 18.37q-4.39 1.25-8.24-1.55z"},{"z":"calves","d":"M983.99 1163.56c7.15-5.59 16.16-.63 17 8.23q4.31 45.02 5.22 90.26c.16 8.25-.8 15.79-2.19 23.65q-.45 2.52-1.43 3.66-.95 1.11-1.22-.33c-5.03-26.7-8.28-53.49-11.87-80.36q-1.68-12.52-3.24-18.71-2.04-8.12-5.53-18.24c-1.03-3 .8-6.25 3.26-8.16z"},{"z":"calves","d":"M1013.69 1150.31c-4.8-2.61-4.66-16.17-4.36-20.75 2.34-36.49 3.44-73.94 1.04-110.45-1.03-15.55.02-31.49.62-47.06q.03-.66.25-.03c2.28 6.45 4.52 12.88 7.39 19.11 5.12 11.14 11.5 22.91 14.83 33.92q2.34 7.74 3.97 16.46 5.3 28.43 5.62 56.09c.2 18.32-7.9 40-22.63 51.79q-3.42 2.73-6.73.92z"},{"z":"calves","d":"M1014.14 1164.37c7-1.83 14.1 2.2 14.11 9.95q.06 29.04-5.62 57.41c-3.87 19.28-6.24 38.23-8.43 57.48a.37.37 0 01-.74-.01q-3.12-43.48-3.58-86.64-.15-14.16.76-28.3c.18-2.83.02-8.98 3.5-9.89z"},{"z":"calves","d":"M1172.94 1149.31c-6.06-4.56-6.94-11.4-6.8-19.4.96-52.67-.49-105.31-3.54-157.9q-.04-.72.41-.16 7.96 10.07 15.43 20.44c9.11 12.64 13.61 28.98 15.78 44.21 4.96 34.71 3.75 72.94-5.97 106.5-1.97 6.82-9.18 10.93-15.31 6.31z"},{"z":"calves","d":"M1144.41 1147.33q-17.19-17.37-20.08-40.86-.89-7.22-.13-19.97 1.18-20.06 4.69-41.33c2.33-14.1 5.8-25.22 12.41-38.61q8.19-16.59 14.35-34.15a.14.13-37.7 01.26.03q1.01 15.71 1.26 31.44c.18 11.61-1.34 24.91-1.58 36.43-.72 34.7 1.22 62.05 2.06 93.19.17 6.32-1.1 26.1-13.24 13.83z"},{"z":"calves","d":"M1173.74 1161.73c6.88-2 14.34 3.23 11.98 10.91-2.24 7.3-4.78 14.44-5.99 21.96-5.07 31.52-8.04 63.18-14.13 94.6a.72.71-61.9 01-1.21.37c-.14-.14-.35-.39-.4-.59q-3.53-13.58-3.19-28.23 1.04-44.67 5.06-87.04c.58-6.1 1.93-10.25 7.88-11.98z"},{"z":"calves","d":"M1154.32 1165a1.58 1.57-84.6 01.97 1.18c.79 4.42 1.42 8.78 1.57 13.4.96 29.17-.47 62.66-2.04 90.23q-.78 13.79-1.39 19.52a.23.23 0 01-.45 0c-2.79-21.25-5.41-41.99-9.64-63.03-3.44-17.08-4.29-34.91-4.68-52.3-.19-8.37 8.99-11.61 15.66-9z"},{"z":"base","d":"M998.25 1320.52c-4.62.24-8.17-1.08-8.78-6.28-1.6-13.81-.75-28.85-2.16-42.41q-.39-3.74.24-7.03a.69.69 0 011.23-.28c2.35 3.15 4.22 5.75 5.14 9.66 1.54 6.57 1.91 22.57 9.97 24.09q13.33 2.5 15.93-10.47c.92-4.57 1-12.33 5.05-17.25q.42-.51.42.15c.11 14.39.4 30.86-3.08 44.54-.79 3.13-3.31 4.23-6.51 4.4q-8.73.45-17.45.88z"},{"z":"base","d":"M1149.5 1319.51c-6.93-.63-6.82-18.08-7.14-23.7q-.73-12.53-.59-25.09.01-.71.45-.15 2.74 3.49 3.29 7.17c1.67 11.25 3.21 25.34 19.7 19.99 4.87-1.58 7.03-18.57 7.89-23.21.79-4.2 2.74-7 5.28-10.13a.56.56 0 01.98.22c1.12 4.6.04 12.39-.37 17.26-.92 10.77-.32 21.48-1.52 32.37q-.7 6.23-7.01 6.18-12.13-.11-20.96-.91z"},{"z":"base","d":"M962.87 1327.38q-.62-.51-.05-1.07l1.99-1.99q.39-.39.93-.41 25.66-.82 51.26 1 1.34.1 4.43 1.47.46.2.69.64 1.84 3.5 2.87 7.23c2.32 8.38-6.63 7.24-12.23 6.68q-15.37-1.53-30.5-4.56c-8.21-1.65-13.33-3.95-19.39-8.99z"},{"z":"base","d":"M1154.35 1341.35c-12.48 1.36-13.27-3.88-8.67-13.37 1.82-3.76 12.72-3.65 16.39-3.77q19.44-.63 38.9-.44c2.41.02 3.31 1 4.61 2.76q.32.44-.09.79c-5.43 4.67-10.52 7.17-17.95 8.74q-16.46 3.47-33.19 5.29z"},{"z":"base","d":"M789.41 726.84c3.98-6.79 9.89-14.6 16.56-20.14a.31.31 0 01.48.35c-4.39 11.06-5.38 21.94-14.02 30.72-5.82 5.93-10.7 9.81-19.04 8.57q-.55-.08-.59-.63c-.24-3.07-.26-7.29 3.1-8.85 4.82-2.26 10.72-5.28 13.51-10.02z"},{"z":"base","d":"M807.27 745.31c17.61 3.49 2.75 13.52-.73 18.99q-10.05 15.82-21.86 30.37-1.56 1.92-2.52-.58a2.41 2.33-55.4 01-.16-.96q.2-5.26 2.75-9.71c6.94-12.09 13.12-24.52 19.72-36.79q.91-1.7 2.8-1.32z"},{"z":"base","d":"M819.3 744.82c-7.79-6.06-14.51-12.4-11.88-23.38 3.07-12.83 14.66-20.7 25.14-26.38 9.57-5.18 37.61-.75 37.6 13.68q-.01 16.24-3.67 31.99c-2.38 10.26-4.49 16.44-16.87 16.3-10.71-.13-21.93-5.7-30.32-12.21z"},{"z":"base","d":"M827.99 758.27a2.08 2.07 26.6 01.91 2.73q-10.47 22.03-19.66 45.04-2.25 5.63-8.23 6.74a1.45 1.44 84.3 01-1.7-1.4q-.1-4.29 1.51-8.31 7.3-18.34 13.86-36.96c.74-2.1 1.53-6.08 2.97-8.96q.26-.5.82-.57 5.05-.64 9.52 1.69z"},{"z":"base","d":"M841.68 762.32a.76.75-79.1 01.6.89q-4.51 23.14-9.28 45.87c-.73 3.49-2.09 5.73-5.85 5.43q-.52-.04-.61-.56-.74-4.54-.32-7.21 2.89-18.57 5.59-37.18.38-2.65 1.67-8.22.13-.54.68-.44l7.52 1.42z"},{"z":"base","d":"M854.75 799.53a.78.78 0 01-1.37-.02q-.91-1.75-1.15-4.29-1.62-16.58-1.2-33.25a.84.84 0 01.61-.78l7.09-1.93q.59-.16.56.45-.58 14.77-1.12 29.56c-.14 4.06-1.54 6.86-3.42 10.26z"},{"z":"base","d":"M1336.39 751.96c-8.72 4.49-29.38 10.28-33.61-3.6q-5.68-18.65-5.83-38.24c-.06-7.59 4.01-11.75 11.09-14.08 8.85-2.92 19.02-5.3 27.54-.35 8.74 5.09 18.39 11.28 22.45 21.01 3.05 7.3 3.34 13.66-1.78 20.01-5.21 6.47-12.49 11.45-19.86 15.25z"},{"z":"base","d":"M1374.32 737.5c-8.05-8.14-9.61-19.67-13.85-30.75a.22.22 0 01.35-.24q10.3 8.96 17.1 20.77c2.57 4.47 9.08 7.59 13.57 9.79 3.11 1.52 2.96 5.9 2.71 8.73q-.05.52-.57.59c-8.87 1.17-13.48-2.98-19.31-8.89z"},{"z":"base","d":"M1383.76 795.45c-.59-.21-.96-.17-1.39-.68-8.84-10.3-15.85-21.5-23.44-32.41-2.81-4.02-8.81-7.64-7.45-13.14q.15-.6.7-.84l7.85-3.44q.66-.29 1.13.25 2.36 2.73 4.17 6.49 7.36 15.23 16.89 31.47c2.33 3.96 3.04 7.59 2.32 11.85a.58.58 0 01-.78.45z"},{"z":"base","d":"M1365.79 812.62c-2.7-.28-6.42-2.66-7.49-5.33q-8.74-21.76-19.85-45.74c-2.12-4.58 6.55-5.17 9.12-5.21 1.8-.03 1.93.71 2.38 2.18q5.72 18.34 15.35 42.12c.74 1.84 4.81 12.43.49 11.98z"},{"z":"base","d":"M1308.16 759.17l7.44 2.1q.23.07.24.31.75 16.26-.86 32.41-.3 3-1.25 5.48a.79.79 0 01-1.42.12q-3.9-6.58-3.82-13.9.16-13.07-.83-26.11-.05-.57.5-.41z"},{"z":"base","d":"M1340.07 814.35c-2.7.82-4.99-1.16-5.54-3.71q-5.06-23.49-9.82-47.47a.77.76-10.7 01.62-.9l7.52-1.38q.59-.11.73.47c2.08 8.53 3.26 19.85 4.22 25.75q2.09 12.92 3.19 21.14.34 2.54-.33 5.46a.86.84 88.4 01-.59.64z"},{"z":"base","d":"M1028.14 166.45c1.03 5.06 1.36 9.61 6.41 11.53 13.06 4.95 16.74 15.51 23.52 27.48 1.387 2.447 3.863 3.623 7.43 3.53a910.025 910.025 0 0136.94-.25c6.23.09 9.27-7.55 11.48-12.3 4.31-9.27 10.37-15.83 20.28-18.94.333-.1.603-.287.81-.56 1.92-2.58 3.043-5.43 3.37-8.55l2.31-1.51a.977.977 0 01.99-.08c11.92 5.42-3.35 35.31-8.21 42.45-.761 1.11-2.423 1.028-3.06-.15l-1.26-2.32c-.133-.253-.32-.297-.56-.13-.34.24-.48.61-.42 1.11.86 7.64.75 16.87-2.96 23.31-.173.3.839.041-3.7 4.71-3.34 3.436-74.18 3.78-75.48-1.38a1.465 1.465 0 00-.55-.82c-4.15-2.97-6.07-7.95-6.16-12.39-.03-1.68.18-14.28-.53-14.63-.207-.1-.33-.037-.37.19-.3 1.553-1.183 2.597-2.65 3.13a.951.951 0 01-1.07-.32c-7.29-9.56-12.32-22.18-12.97-33.54-.34-6.04 1.797-9.23 6.41-9.57zm29.95 61.71c.173 14.187 18.967 14.703 19.1-1.37.03-4.05-.38-6.54-4.68-7.3-4.2-.75-11.87-1.47-13.85 2.91-.413.92-.603 2.84-.57 5.76zm31.71-3.35c.36 19.647 18.59 14.82 18.87 5.94.13-3.9 1.32-9.43-2.88-10.79-4.25-1.38-16.12-2.54-15.99 4.85z"},{"z":"base","d":"M1138.38 168.39q-.49 4.68-3.37 8.55-.31.41-.81.56c-9.91 3.11-15.97 9.67-20.28 18.94-2.21 4.75-5.25 12.39-11.48 12.3q-18.46-.25-36.94.25-5.35.14-7.43-3.53c-6.78-11.97-10.46-22.53-23.52-27.48-5.05-1.92-5.38-6.47-6.41-11.53q-6.64-26.16 4.43-48.88c8.13-16.7 34.61-21.41 51.58-21.04 4.89.11 9.69-.11 14.42.85 18.79 3.8 33.17 8.5 39.34 28.66q6.38 20.88.47 42.35z"}],"femaleFront":[{"z":"base","d":"m 332.05,262.18 c -0.78,8.99 -5.96,18.06 -11.27,26.44 a 0.35,0.35 0 0 1 -0.59,0.01 q -6.05,-9.29 -9.58,-18.59 -1.68,-4.42 -1.62,-8.04 0.06,-3.36 4.03,-3.55 6.44,-0.31 14.09,-0.13 c 2.41,0.05 5.19,0.99 4.94,3.86 z"},{"z":"base","d":"m 290.15,290.93 c 3.28,4.65 5.62,9.8 7.15,15.32 0.7,2.53 -1.37,5.04 -3.97,5.05 q -6.56,0.04 -11.88,-2.03 a 2.07,2.06 14.4 0 1 -1.3,-2.18 c 0.77,-5.99 4.87,-11.91 8.89,-16.23 a 0.72,0.71 -41.3 0 1 1.11,0.07 z"},{"z":"base","d":"m 301.06,294.13 c -3.51,-6.07 -6.56,-12.38 -9.23,-18.87 q -1.42,-3.46 -1.56,-6.85 -0.36,-8.56 0.86,-17.74 a 0.44,0.44 0 0 1 0.53,-0.37 q 0.46,0.1 0.79,0.48 4.65,5.35 7.86,11.31 c 6.42,11.93 11.65,25.19 18.44,37.61 a 5.28,5.26 30.8 0 1 0.66,2.59 L 319.3,321 a 0.79,0.79 0 0 1 -0.79,0.79 c -1.83,0 -3.44,-1.1 -4.21,-2.73 q -5.68,-11.89 -13.24,-24.93 z"},{"z":"base","d":"m 328.11,315.98 c -1.39,2.8 -1.85,5.31 -5.45,5.84 a 0.92,0.91 85.6 0 1 -1.04,-0.9 q -0.09,-9.72 -0.08,-18.23 0,-1.57 0.75,-3.05 6.71,-13.16 12.25,-25.58 c 3.49,-7.85 8.12,-17.17 14.42,-23.56 q 0.19,-0.18 0.45,-0.19 a 0.43,0.42 -3.6 0 1 0.44,0.38 q 0.95,7.84 0.93,15.61 -0.02,4.3 -1.34,7.91 -3.03,8.27 -7.56,16.2 -8.05,14.11 -13.77,25.57 z"},{"z":"base","d":"m 343.58,306.54 c 1.42,-5.58 3.9,-10.86 7.19,-15.57 a 0.69,0.68 -50.1 0 1 1.04,-0.1 c 3.9,3.84 9.01,11.14 8.89,17.13 a 1.07,1.06 79.1 0 1 -0.65,0.97 q -5.44,2.34 -12.5,2.38 c -2.39,0.01 -4.57,-2.43 -3.97,-4.81 z"},{"z":"back","d":"m 241.01,294.28 c 12.76,-8.28 25.21,-16.07 39.54,-21.44 2.58,-0.96 6.02,0.04 5.63,3.51 q -0.44,3.92 -1.62,5.3 c -6.48,7.58 -12.74,12.81 -19.24,19.14 -1.03,1.01 -1.87,1.15 -3.25,1.03 q -8.13,-0.69 -18.79,-2.97 -2.99,-0.65 -2.7,-3.86 0.05,-0.46 0.43,-0.71 z"},{"z":"back","d":"m 366.31,275.29 c 12,4.97 22.67,11.96 33.55,18.94 q 0.51,0.33 0.54,0.94 c 0.08,1.63 -0.71,3.2 -2.44,3.59 q -9.65,2.18 -18.62,2.99 c -1.26,0.11 -2.4,0.24 -3.39,-0.7 q -5.03,-4.78 -10.97,-10.25 -6.53,-6.01 -8.56,-9.16 -1.87,-2.89 -1.63,-6.77 0.03,-0.49 0.35,-0.85 c 3.04,-3.4 7.94,-0.07 11.17,1.27 z"},{"z":"base","d":"m 274.27,0 h 7.5 q 18.53,1.85 32.68,8.03 c 12.49,5.46 24.03,14.94 27.55,28.42 a 2.51,2.49 89.9 0 0 1.78,1.79 c 62.05,16.11 59.99,92.38 46.77,140.06 q -2.56,9.24 -6.49,17.96 c -2.53,5.64 -4.61,7.93 -10.53,9.62 l -0.26,-0.1 q -0.2,-0.09 -0.11,-0.29 3.73,-8.25 6.16,-16.1 a 1.18,1.17 -83.3 0 1 1.03,-0.82 c 9.73,-0.81 11.84,-26.25 11.81,-33.17 q 0,-2.26 -1.89,-3.46 -0.54,-0.35 -1.17,-0.24 -2.13,0.37 -4.08,0.23 c -5.7,-0.39 -8.68,-13.45 -9.55,-17.9 q -2.57,-13.24 -5.09,-28.6 -0.65,-3.97 -2.37,-7.72 a 2.7,2.65 86.8 0 0 -1.54,-1.4 C 357.04,93.05 347.03,89.65 337,88.5 q -7.76,-0.88 -14.28,3.52 c -7.75,5.24 -15.65,10.37 -23.95,14.33 q -15.27,7.3 -31.5,12.13 a 1.86,1.85 -0.3 0 0 -1.25,1.26 c -2.08,7.3 -3.02,14.59 -4.33,22.04 -0.77,4.35 -2.6,10.1 -8.02,10.27 q -1.4,0.05 -2.82,-0.07 -0.58,-0.04 -0.95,0.42 -1.31,1.64 -1.26,3.95 0.23,12.21 3.9,23.14 c 1.3,3.87 3.66,8.51 8.11,9.16 a 1.22,1.22 0 0 1 0.99,0.84 q 5.67,17.91 15.65,33.72 0.59,0.93 0.76,2 0.62,15.66 -0.31,31.34 -0.33,0.59 -0.86,1.05 -10.81,9.38 -25.26,12.16 -3.21,-0.66 -6.4,-1 -2.96,-0.31 -6.35,-1.14 -4.1,-0.99 -8.5,-0.85 -19.12,0.63 -38.2,1.5 -7.58,0.35 -14.57,-0.86 a 1.74,1.73 -87.9 0 1 -1.44,-1.56 c -0.81,-8.45 2.45,-17.97 5.45,-25.54 7.91,-19.94 16.52,-39.52 21.72,-59.8 q 3.8,-14.84 3.36,-29.24 -0.62,-20.32 -5.16,-56.52 -0.99,-7.83 -0.58,-13.57 1.97,-27.81 13.7,-48.73 C 220.38,22.24 229.09,15.56 238.9,9.81 Q 254.97,0.39 274.27,0 Z m 61.27,35.35 c -9.93,-7.61 -23.32,-7.23 -32.78,1.35 q -1.11,1.01 0.36,0.73 c 10.93,-2.09 20.77,-2.59 31.88,-0.82 q 2.75,0.43 0.54,-1.26 z"},{"z":"base","d":"m 302.76,36.7 c 9.46,-8.58 22.85,-8.96 32.78,-1.35 q 2.21,1.69 -0.54,1.26 c -11.11,-1.77 -20.95,-1.27 -31.88,0.82 q -1.47,0.28 -0.36,-0.73 z"},{"z":"shoulders","d":"m 215.94,289.45 c -21.5,15.97 -35.81,41.69 -45.18,66.64 a 0.54,0.54 0 0 1 -0.75,0.3 c -1.36,-0.68 -2.91,-1.32 -2.88,-3.16 q 0.36,-18.38 4.6,-33.36 c 4.12,-14.55 12.32,-23.54 25.35,-31.51 5.06,-3.09 15.01,-5.79 18.99,0.41 a 0.51,0.51 0 0 1 -0.13,0.68 z"},{"z":"shoulders","d":"m 233,326.79 c -5.53,27.66 -26.78,45.52 -55.22,43.68 a 0.54,0.54 0 0 1 -0.5,-0.61 c 4.48,-32.74 28.09,-58.38 54.53,-76.41 q 2.3,-1.57 4.86,-0.86 a 1.61,1.61 0 0 1 1.18,1.72 Q 236,311.81 233,326.79 Z"},{"z":"shoulders","d":"M 470.13,355.96 C 463.5,338.45 454.92,322.09 443.6,307.63 q -8.16,-10.43 -18.47,-18.02 a 0.95,0.94 33.2 0 1 -0.26,-1.22 c 3.34,-5.94 13.06,-3.27 17.74,-0.68 13.57,7.5 23.02,17.38 27.32,32.28 q 3.99,13.8 4.29,33.5 0.02,0.68 -0.47,1.17 -1.06,1.07 -2.71,1.71 a 0.71,0.71 0 0 1 -0.91,-0.41 z"},{"z":"shoulders","d":"m 463.02,370.48 c -23.85,1.37 -44.22,-11.24 -52.35,-33.91 q -2.31,-6.45 -3.64,-14.34 -2.64,-15.63 -3.89,-27.26 -0.28,-2.56 2.36,-2.63 1.96,-0.05 4.36,1.61 c 25.95,18.03 49.33,43.22 53.78,75.78 q 0.1,0.71 -0.62,0.75 z"},{"z":"base","d":"m 333.98559,84.905706 c 18.21278,1.634629 31.69605,8.136487 37.2945,12.907787 5.05164,4.305277 7.19576,45.031667 12.65256,51.693107 1.8636,2.27501 8.59028,-1.54865 8.92968,2.02054 0.963,10.12704 -1.13955,23.87461 -5.01774,34.09876 -2.76635,7.29296 -5.63968,2.08994 -7.32662,6.61326 -4.20041,11.26291 -13.37526,37.43537 -39.7435,47.10729 -18.23028,5.87857 -27.73171,4.95957 -42.38166,-0.61061 -10.53425,-7.41801 -26.32238,-15.61151 -35.48901,-45.82179 -2.15595,-7.10532 -5.07953,-2.63217 -8.24698,-7.1806 -8.2816,-11.89228 -6.24233,-24.37427 -6.11257,-33.09312 1.24002,-3.08768 8.39807,0.42491 9.86574,-4.98496 1.75809,-6.48033 5.74751,-21.52642 6.67934,-30.11758 42.80886,-10.2119 49.53647,-34.194904 68.89626,-32.632084 z"},{"z":"chest","d":"m 215.31,402.8 c 3.26,-19.61 9.28,-38.69 19.81,-54.85 q 13.83,-21.23 37.68,-27.16 c 4.19,-1.04 8.16,-1.75 12.65,-1.52 q 12.07,0.63 26.16,3.99 1.78,0.43 1.87,2.25 1.29,25.82 3.16,54.8 0.99,15.38 0.3,27.45 -0.37,6.41 -1.94,10.48 c -1.58,4.08 -6.16,7.97 -9.72,10.84 -4.33,3.5 -10.61,4.16 -16,3.9 q -10.92,-0.53 -23.26,-4.83 c -17.71,-6.16 -33.56,-14.26 -50.09,-24.02 a 1.31,1.29 20.5 0 1 -0.62,-1.33 z"},{"z":"chest","d":"m 363.91,319.81 c 13.87,2.63 26.6,9.35 35.84,20.13 14.46,16.89 22.21,40.73 25.93,63.05 q 0.11,0.67 -0.48,1.03 -23.28,13.86 -44.52,22.12 c -11.73,4.57 -25.54,8.27 -37.94,6.2 -5.84,-0.97 -14.69,-8.68 -16.85,-14.18 q -1.62,-4.13 -2.04,-13.18 -0.45,-9.71 0.29,-21.75 1.69,-27.64 3.41,-58.27 a 1.18,1.16 -22 0 1 0.33,-0.76 q 0.76,-0.78 1.88,-1.05 11.52,-2.78 22.73,-3.71 6.58,-0.54 11.42,0.37 z"},{"z":"biceps","d":"m 155.35,437.19 c 0.88,-13.89 5.09,-26.01 11.66,-38.24 4.28,-7.95 13.01,-13.06 21.68,-14.64 q 5.04,-0.91 8.47,-1.31 c 3.81,-0.44 9.89,1.7 10.16,6.4 q 0.6,10.54 -0.27,19.31 c -1.87,18.75 -10.06,34.69 -22.69,48.75 q -8.64,9.63 -17.84,18.84 a 1.95,1.9 16.8 0 1 -0.98,0.51 q -3.19,0.6 -7.01,-0.16 c -1.52,-0.3 -2.45,-1.78 -2.7,-3.22 -0.63,-3.64 -1.32,-7.25 -1.31,-10.96 q 0.05,-12.9 0.83,-25.28 z"},{"z":"biceps","d":"m 478.52,408.27 q 5.57,13 6.67,24.56 1.21,12.62 1.22,28.51 0,5.95 -1.27,12.12 c -0.81,3.98 -5.47,3.81 -8.54,3.62 q -1.7,-0.11 -3.27,-1.75 c -13.93,-14.57 -28.48,-28.44 -35.35,-48.06 -4.33,-12.36 -5.34,-25.85 -4.21,-39.01 q 0.06,-0.73 0.51,-1.3 c 2.72,-3.44 6.57,-4.44 11.44,-3.76 q 7.25,1.01 11.78,2.52 9.47,3.16 14.86,10.89 3.02,4.33 6.16,11.66 z"},{"z":"triceps","d":"m 203.67,452.99 c -7.1,14.55 -18.61,30.01 -32.29,39.49 q -2.32,1.61 -4.85,0.35 l -0.31,-0.15 q -2.42,-1.22 -0.37,-2.98 c 17.2,-14.83 28.72,-32 37.23,-52.62 q 0.8,-1.93 2.34,-3.04 a 1.28,1.28 0 0 1 1.8,0.31 q 1.35,1.95 0.97,4.41 -1.1,7.22 -4.52,14.23 z"},{"z":"triceps","d":"m 442.12,446.42 q 12.14,25.77 33.26,43.55 1.47,1.24 -0.14,2.3 l -0.63,0.42 a 4.39,4.37 45.8 0 1 -4.92,-0.08 q -8.08,-5.68 -15.21,-13.9 c -9.9,-11.44 -19.12,-25.17 -21.69,-39.38 q -0.62,-3.4 1.39,-5.43 0.44,-0.44 0.99,-0.15 1.54,0.81 2.17,2.22 2.35,5.31 4.78,10.45 z"},{"z":"abs","d":"m 234.32,446.92 c -0.55,-2.95 -0.73,-5.84 -1.94,-8.63 q -4.84,-11.24 -8.61,-21.89 -1.12,-3.17 1.19,-0.73 c 6.09,6.44 10.93,13.52 16.12,20.74 a 1.71,1.68 28.7 0 1 0.33,1.09 q -0.53,11.15 -1.88,22.64 -0.27,2.38 -1.24,0.18 -2.52,-5.75 -3.97,-13.4 z"},{"z":"abs","d":"m 242.67,456.5 c 3.65,1.14 7.61,3.78 10.54,6.08 q 2.32,1.82 2.25,4.78 l -0.21,8.13 q -0.04,1.79 -1.45,0.68 -5.7,-4.52 -10.18,-10.21 c -1.95,-2.48 -2.49,-5.57 -2.19,-8.64 a 0.96,0.96 0 0 1 1.24,-0.82 z"},{"z":"abs","d":"m 246.6,490.48 c -6.03,-4.05 -7.7,-15.15 -7.34,-21.92 a 0.29,0.29 0 0 1 0.5,-0.19 c 4.79,4.87 9.23,10.01 14.82,13.93 a 1.71,1.7 17.7 0 1 0.72,1.39 l -0.03,11.84 a 0.6,0.6 0 0 1 -0.96,0.47 q -4.04,-3.05 -7.71,-5.52 z"},{"z":"abs","d":"m 252.02,456.3 c -3.08,-1.43 -6.59,-6.27 -8.84,-9.51 q -1.03,-1.49 -0.89,-3.31 a 1.39,1.38 -88.2 0 1 1.35,-1.28 q 2.27,-0.04 4.18,0.73 4.36,1.77 9.23,3.14 0.54,0.15 0.58,0.71 0.4,6.12 -1.21,11.67 a 0.35,0.35 0 0 1 -0.56,0.18 q -1.73,-1.34 -3.84,-2.33 z"},{"z":"abs","d":"m 257.8,616.66 c -4.79,-0.24 -10.33,-3.88 -14.25,-6.47 -3.22,-2.12 -4.01,-14.52 -4.21,-18.14 q -0.65,-12.12 -0.53,-21.74 0.32,-25.23 0.51,-50.71 c 0.03,-4.43 0.42,-8.84 0.73,-13.1 q 0.3,-4 1.6,-7.53 0.76,-2.05 2.82,-1.27 c 12.29,4.68 12.69,15.09 12.12,26.28 q -0.16,3.03 0.13,5.86 2.02,19.75 1.8,41.33 -0.05,4.7 0.76,9.52 1.4,8.43 2.19,17.36 0.85,9.42 -2.51,17.86 a 1.18,1.17 -77.7 0 1 -1.16,0.75 z"},{"z":"abs","d":"m 259.53,441.27 c -6.09,-0.94 -15.24,-7.47 -17.83,-12.96 a 1.96,1.95 -46.6 0 1 -0.04,-1.54 c 0.68,-1.67 2.51,-1.45 3.82,-0.88 q 8.66,3.77 17.36,6.42 a 0.45,0.45 0 0 1 0.31,0.35 q 0.79,4.96 -2.71,8.32 -0.38,0.37 -0.91,0.29 z"},{"z":"abs","d":"m 384.22,445.83 c 4.32,-0.61 8.05,-3.04 12.37,-3.63 q 1.44,-0.19 1.87,1.19 0.52,1.66 -0.54,3.18 c -4.17,5.96 -7.23,9.14 -12.91,11.89 a 0.38,0.38 0 0 1 -0.53,-0.24 q -1.53,-5.28 -1.13,-11.45 a 1.03,1.01 88.3 0 1 0.87,-0.94 z"},{"z":"abs","d":"m 393.51,426.7 q 1.7,-0.72 3.57,-1.16 a 1.83,1.83 0 0 1 1.91,0.73 c 0.66,0.94 0.41,2.29 -0.25,3.15 q -6.32,8.23 -15.71,11.52 -3.03,1.06 -4.1,-1.97 -1.12,-3.14 -1.26,-3.53 -1.02,-2.87 1.9,-3.71 6.45,-1.87 13.94,-5.03 z"},{"z":"abs","d":"m 397.15,610.37 c -3.94,2.47 -9.2,6.06 -13.86,6.26 a 1.49,1.48 77.9 0 1 -1.43,-0.93 q -3.33,-8.47 -2.36,-18.41 0.73,-7.6 1.89,-14.77 1,-6.17 0.99,-11.23 c -0.02,-13.26 0.27,-26.67 1.74,-39.85 q 0.47,-4.28 0.19,-8.9 c -0.66,-10.78 0.81,-21.31 12.66,-24.94 a 1.78,1.77 69.5 0 1 2.14,0.98 q 1,2.27 1.34,4.92 1.19,9.27 1.26,20.24 0.16,23.43 0.38,48.3 c 0.09,11.08 -0.18,22.85 -2.37,33.89 -0.34,1.72 -0.99,3.45 -2.57,4.44 z"},{"z":"abs","d":"m 398.41,456.38 a 0.8,0.8 0 0 1 1.09,0.63 c 0.86,5.62 -1.96,9.16 -5.73,13.05 q -3.65,3.78 -7.3,6.56 a 0.41,0.41 0 0 1 -0.66,-0.3 q -0.29,-4.61 -0.24,-8.98 0.03,-3.34 2.9,-5.44 4.69,-3.42 9.94,-5.52 z"},{"z":"abs","d":"m 401.76,469.17 c 0.19,6.21 -1.1,14.25 -5.22,19.11 -2.62,3.1 -6.7,5.34 -10.07,7.78 q -0.73,0.53 -0.74,-0.38 l -0.07,-12.12 q 0,-0.59 0.46,-0.96 8.07,-6.31 14.53,-13.82 1.06,-1.24 1.11,0.39 z"},{"z":"abs","d":"m 417.44,415.21 c -2.14,7.47 -5.47,14.6 -8.52,22.06 q -1.36,3.31 -1.79,6.59 -1.11,8.53 -4.58,16.68 -0.79,1.86 -1.07,-0.14 -1.42,-10.38 -1.9,-22.98 a 1.58,1.57 -28.9 0 1 0.29,-1 q 6.57,-9.46 12.8,-17.21 1.87,-2.32 4.3,-4.31 0.73,-0.59 0.47,0.31 z"},{"z":"abs","d":"m 261.73,482.62 c 0.12,-10.88 -0.33,-22.8 7.93,-31.04 10.43,-10.39 25.75,-12.91 39.95,-10.63 q 0.47,0.08 0.45,0.54 l -0.87,24.33 a 0.96,0.95 88.3 0 1 -0.86,0.92 q -8.51,0.88 -17.53,2.35 c -11.22,1.83 -20.06,5.16 -28.09,13.92 q -1,1.08 -0.98,-0.39 z"},{"z":"abs","d":"m 263.89,560.38 c 18.37,-2.6 32.63,0.35 44.32,15.16 q 0.72,0.91 0.91,2.02 0.98,5.72 1.19,10.92 2.01,48.7 2.07,81.21 0.01,2.91 -2.63,5.03 c -2.77,2.21 -10.61,5.88 -13.52,2.38 -6.1,-7.32 -10.49,-16.08 -14.05,-25.36 q -14.5,-37.75 -18.65,-78.2 -0.6,-5.83 -0.33,-12.39 0.03,-0.68 0.69,-0.77 z"},{"z":"abs","d":"m 283.92,476.78 q 12.55,-5.43 25.84,-3.32 0.36,0.06 0.36,0.42 0.41,19.6 -0.86,38.86 a 0.91,0.91 0 0 1 -1,0.85 c -13.44,-1.32 -28.43,-1.82 -41.54,1.88 q -1.32,0.37 -1.93,-0.86 c -9,-18.41 3.35,-31 19.13,-37.83 z"},{"z":"abs","d":"m 300.31,556.68 q -4.15,-2.21 -8.98,-2.91 -13.66,-2 -27.37,-1.31 a 0.95,0.95 0 0 1 -0.97,-0.72 q -2.73,-10.93 -1.37,-23.2 0.2,-1.78 1.77,-2.92 c 6.36,-4.65 14.69,-8.3 22.33,-8.94 q 12.38,-1.05 23.44,4.26 a 2.06,2.06 0 0 1 1.17,1.89 q -0.3,18.75 -1.38,35.86 -0.03,0.52 -0.55,0.61 c -2.7,0.45 -5.69,-1.34 -8.09,-2.62 z"},{"z":"abs","d":"m 349.65,553.77 c -5.34,0.78 -9.22,3.16 -13.94,5.24 q -1.59,0.69 -3.28,0.24 a 0.64,0.63 -83.8 0 1 -0.47,-0.59 q -1.23,-19.64 -1.28,-36.09 a 1.7,1.68 -13.4 0 1 0.95,-1.53 c 15.64,-7.64 31.83,-5.42 45.86,4.48 0.94,0.67 1.65,1.44 1.78,2.61 q 1.39,12.16 -1.2,23.23 -0.25,1.07 -1.34,1.03 -13.86,-0.54 -27.08,1.38 z"},{"z":"abs","d":"m 354.08,475.63 c 16.7,6.15 32.39,19.94 21.71,39.55 a 0.9,0.9 0 0 1 -1.05,0.43 c -13.38,-3.92 -27.7,-3.22 -41.96,-2.05 a 0.9,0.9 0 0 1 -0.97,-0.78 c -1.62,-12.74 -1.1,-26.27 -1.03,-38.85 a 0.48,0.47 86.4 0 1 0.4,-0.46 q 11.86,-1.91 22.9,2.16 z"},{"z":"abs","d":"m 362.23,642.32 c -4.21,12.26 -9.35,24.52 -17.49,34.79 q -0.9,1.12 -2.2,1.22 -6.54,0.54 -11.69,-3.91 c -1.34,-1.16 -2.37,-2.61 -2.35,-4.44 q 0.27,-32.33 1.7,-73.01 0.36,-10.37 1.51,-19.31 0.12,-0.89 0.67,-1.6 c 11.52,-15 26.64,-18.71 44.72,-15.65 a 0.85,0.84 -86 0 1 0.71,0.83 q 0.06,12.43 -1.93,25.22 -4.56,29.34 -13.65,55.86 z"},{"z":"abs","d":"m 378.34,483.09 c -8.04,-8.87 -17.3,-12.26 -29.19,-14.16 q -8.48,-1.35 -16.49,-2.17 a 1.05,1.04 2.2 0 1 -0.93,-1 l -0.83,-24.24 q -0.02,-0.53 0.51,-0.61 18.35,-2.62 31.52,4.43 14.18,7.59 15.53,22.29 0.76,8.32 0.7,15.15 -0.01,1.2 -0.82,0.31 z"},{"z":"forearms","d":"m 80.93,647.88 c 14.1,-28.26 32.44,-54.05 52.98,-78.01 6.28,-7.32 12.52,-13.04 22.3,-14.76 a 0.44,0.44 0 0 1 0.44,0.67 q -33.59,51.14 -75.12,92.53 -1.62,1.61 -0.6,-0.43 z"},{"z":"forearms","d":"m 85.85,647.42 q 11.51,-11.53 23.19,-23.33 6.63,-6.71 16.74,-19.55 c 13.51,-17.18 26.63,-37.24 39.52,-56.02 a 1.08,1.08 0 0 1 1.85,0.11 q 0.51,0.96 0.26,2.09 c -1.73,8.15 -5.44,14.39 -10.55,22.73 q -11.14,18.18 -25.7,34.1 -18.98,20.74 -39.21,37.61 -2.7,2.25 -6.02,3.82 -0.28,0.13 -0.57,0.24 -1.42,0.54 -1.26,-0.09 0.03,-0.14 0.14,-0.23 0.8,-0.67 1.61,-1.48 z"},{"z":"forearms","d":"m 158.49,493 c -4.72,28.27 -19.05,55.5 -36.58,78.04 q -10.8,13.89 -20.36,28.46 -4.33,6.6 -7.59,13.38 c -5.52,11.5 -11.24,22.8 -19.41,32.11 q -1.49,1.7 -0.81,-0.46 c 3.77,-11.82 9.38,-23.48 14.74,-35.02 3.82,-8.21 7.5,-17.64 10.42,-26.75 7.62,-23.71 16.99,-47.77 29.34,-68.38 7.41,-12.37 17.14,-24.67 29.9,-31.38 a 0.72,0.71 -14.7 0 1 1.05,0.61 q 0.12,4.42 -0.7,9.39 z"},{"z":"forearms","d":"m 176.77,536.74 c -5.58,2.64 -11.34,4.68 -16.45,7.91 -5.83,3.68 -11.93,7.82 -18.84,8.99 a 1.21,1.21 0 0 1 -1.41,-1.13 c -0.29,-5.42 4.57,-12.34 7.66,-16.52 q 10.15,-13.75 23.71,-26.94 c 1.35,-1.32 3.26,-2.11 5.16,-1.83 a 1.02,1.02 0 0 1 0.86,0.86 q 2.03,13.42 -0.05,27.79 a 1.12,1.12 0 0 1 -0.64,0.87 z"},{"z":"forearms","d":"m 478.46,543.49 c -4.04,-2.35 -8.89,-4.3 -13.28,-6.25 -2.13,-0.95 -1.9,-3.18 -2.11,-5.15 q -1.32,-12.65 0.43,-23.9 a 1.38,1.38 0 0 1 1.54,-1.16 c 1.68,0.21 3.26,0.93 4.5,2.12 q 12.39,11.96 22.31,25.05 c 2.67,3.51 10.26,13.94 8.99,18.38 a 1.51,1.51 0 0 1 -1.8,1.06 q -5.3,-1.25 -8.83,-3.31 -5.39,-3.14 -11.75,-6.84 z"},{"z":"forearms","d":"m 480.72,568.04 c -3.26,-5.55 -5.96,-11.12 -7.24,-17.31 q -0.33,-1.61 0.58,-2.51 a 1.03,1.03 0 0 1 1.57,0.16 c 13.24,19.66 27,40.11 41.05,58.18 11.56,14.88 25.47,28 38.8,41.13 q 0.56,0.55 1.06,1.21 0.78,1.05 -0.44,0.58 -3.39,-1.29 -6.75,-4.08 -19.67,-16.3 -37.87,-35.97 -17.53,-18.94 -30.76,-41.39 z"},{"z":"forearms","d":"m 484.61,555.07 c 11.21,1.91 17.39,8.95 24.45,17.26 18.64,21.97 34.4,44.56 47.76,69.37 q 1.9,3.52 3.32,6.62 0.61,1.33 -0.43,0.3 -42.24,-42.1 -75.48,-92.97 -0.48,-0.73 0.38,-0.58 z"},{"z":"forearms","d":"m 540.63,578.72 c 5.89,18.68 13.76,35.38 21.55,52.65 q 2.61,5.79 4.88,12.9 0.81,2.52 -0.89,0.5 c -7.48,-8.88 -12.5,-17.92 -17.97,-29.24 q -6.73,-13.92 -15.23,-25.62 -8.17,-11.25 -17.48,-23.63 c -15.23,-20.26 -27.78,-45.5 -32.6,-70.62 q -1.21,-6.31 -1.13,-11.97 0.01,-1.19 1.06,-0.64 c 10.4,5.42 18.51,14.3 25.31,24.31 13.82,20.33 24.84,47.05 32.5,71.36 z"},{"z":"base","d":"m 76.9,699.46 c -1.68,6.93 -4.86,14.23 -9.75,19.73 -3.68,4.16 -10.21,-0.6 -12.84,-3.77 q -4.85,-5.86 -10.18,-10.8 c -2.03,-1.88 -9.58,-5.18 -8.37,-9.02 2,-6.4 4.37,-11.1 8.21,-16.74 q 5.74,-8.42 12.12,-17.03 2.99,-4.03 5.79,-6.44 1.65,-1.41 4.25,-0.76 7.51,1.87 13.62,4.2 a 0.47,0.47 0 0 1 0.29,0.4 q 1.61,20.71 -3.14,40.23 z"},{"z":"base","d":"m 22.64,686.61 q -4.35,2.68 -8.97,5.43 -2,1.2 -3.76,0.73 -2.04,-0.55 -3.53,-1.72 a 1.59,1.59 0 0 1 -0.52,-1.77 q 0.73,-2.04 2.74,-3 5.14,-2.46 10.34,-5.1 a 13.93,13.75 -80.7 0 0 3.47,-2.53 c 3.04,-3.03 6.28,-5.7 9.81,-8.15 q 6.86,-4.77 13.58,-9.74 c 1.68,-1.24 2.71,-1.36 4.54,-0.38 4.66,2.47 -4.59,11.2 -6.57,12.67 -6.61,4.92 -13.95,9.14 -21.13,13.56 z"},{"z":"base","d":"m 32.82,715.26 q -5.43,14.93 -12.06,27.84 -1.98,3.85 -4.71,6.75 a 1.67,1.66 51.8 0 1 -2.66,-0.32 c -2.02,-3.56 1,-13.05 2.6,-16.84 q 6.53,-15.37 13.87,-30.34 1.12,-2.28 2.93,-0.51 l 2.38,2.35 q 1.73,1.69 0.66,3.87 -1.5,3.03 -3.01,7.2 z"},{"z":"base","d":"m 32.18,751.27 q -3.61,7.78 -7.04,13.77 -0.8,1.41 -2.48,1.29 a 2.04,2.04 0 0 1 -1.82,-1.48 q -0.59,-2.11 -0.16,-4.36 1.46,-7.75 4.24,-15.75 5.55,-15.95 13.53,-31.52 a 0.92,0.91 -74.1 0 1 0.89,-0.5 c 2.55,0.22 5.63,1.06 5.19,4.36 q -0.48,3.64 -1.61,7.19 -3.97,12.44 -10.74,27 z"},{"z":"base","d":"m 54.56,726.38 c -4.87,12.51 -10.55,24.74 -16.83,36.91 q -1.47,2.85 -4.02,0.9 -0.2,-0.16 -0.33,-0.36 -1.89,-2.86 -0.7,-5.81 c 4.9,-12.05 9.63,-24.27 15.68,-36.05 q 0.94,-1.84 2.66,-0.68 l 2.47,1.68 q 1.89,1.28 1.07,3.41 z"},{"z":"base","d":"m 53.04,752.14 c 1.93,-10.58 3.66,-20.18 11.74,-27.88 a 0.88,0.88 0 0 1 1.43,0.33 q 0.18,0.48 0.07,0.95 -3.65,14.78 -9.97,27.42 -0.75,1.49 -1.97,2.17 a 1.06,1.06 0 0 1 -1.57,-1.02 q 0.09,-0.98 0.27,-1.97 z"},{"z":"base","d":"m 572.57,717.95 c -4.99,-6.62 -7.75,-14.53 -9.42,-22.45 q -3.74,-17.75 -2.3,-36.07 0.04,-0.54 0.55,-0.72 6.91,-2.55 14.55,-4.31 a 3.01,2.98 -33.7 0 1 2.4,0.47 q 2.39,1.67 4.36,4.26 11.12,14.61 17.14,24.22 2.19,3.48 3.91,8.26 c 1.42,3.93 2.9,6.43 -1.05,8.84 -6.91,4.23 -11.6,9.71 -16.7,15.64 q -2.2,2.56 -5.58,4.02 -4.71,2.02 -7.86,-2.16 z"},{"z":"base","d":"m 629.7,692.91 q -0.88,0.05 -1.63,-0.39 -16.99,-9.79 -30.39,-19.09 -5.44,-3.78 -8.34,-10.22 a 1.71,1.66 45.9 0 1 0,-1.38 c 0.82,-1.77 3.4,-2.74 5.14,-1.47 6.84,4.98 13.95,9.43 20.22,14.76 2.49,2.13 4.62,4.61 7.54,6.13 q 5.16,2.68 10.13,5.06 1.59,0.76 2.51,2.34 a 1.98,1.97 56.7 0 1 -0.53,2.58 q -2.03,1.52 -4.65,1.68 z"},{"z":"base","d":"m 619.38,741.59 c -5.55,-10.95 -9.91,-22.4 -14.42,-34.16 q -0.76,-1.97 0.82,-3.38 1.39,-1.24 2.48,-2.21 1.76,-1.58 2.8,0.54 8.21,16.69 14.65,32.42 2.73,6.68 2.32,13.6 -0.1,1.72 -1.83,1.98 a 1.61,1.58 -24.2 0 1 -1.45,-0.54 q -2.91,-3.38 -5.37,-8.25 z"},{"z":"base","d":"m 615.42,764.65 c -7.37,-14.18 -14.47,-29.6 -18.64,-45 q -0.59,-2.21 -0.29,-4.52 0.07,-0.54 0.54,-0.83 1.9,-1.18 4.13,-1.51 1,-0.15 1.46,0.75 7.03,13.62 12.86,29.78 3.2,8.87 4.64,16.66 0.36,1.96 0.12,4.04 c -0.34,2.92 -3.74,2.72 -4.82,0.63 z"},{"z":"base","d":"M 603.2,763.32 C 597.32,751.95 590.92,738.6 586.42,726.4 q -0.8,-2.15 1.08,-3.48 l 2.22,-1.57 q 1.83,-1.29 2.86,0.69 c 6.13,11.73 10.79,24.28 15.74,36.17 q 1.16,2.78 -0.76,5.72 -0.12,0.18 -0.3,0.32 -2.58,1.93 -4.06,-0.93 z"},{"z":"base","d":"m 585.43,754.04 c -5.15,-8.61 -8.65,-19.26 -10.81,-28.78 q -0.46,-2.03 1.32,-0.96 1.2,0.73 2.2,1.88 c 6.71,7.78 8.51,18.11 10.03,28.15 a 0.6,0.59 -12.9 0 1 -0.42,0.66 q -1.5,0.43 -2.32,-0.95 z"},{"z":"quads","d":"m 286.21,731.89 c 5.1,-12.47 11.15,-24.68 16.82,-36.79 a 1.17,1.17 0 0 1 1.84,-0.38 q 0.8,0.71 0.75,1.93 c -0.46,12.38 -1.19,24.44 -2.76,37.71 -1.13,9.56 -1.91,19.14 -3.49,28.56 -0.69,4.17 -2.41,8.04 -4.32,11.69 a 2.22,2.21 29.3 0 1 -3.12,0.87 q -1.32,-0.8 -1.28,-2.41 0.2,-8.82 0.13,-17.67 -0.01,-1.4 -0.62,-2.66 c -2.16,-4.44 -4.98,-9.87 -5.17,-14.91 q -0.11,-2.7 1.22,-5.94 z"},{"z":"quads","d":"m 292.87,682.52 c -3.12,14.57 -9.61,27.39 -18.76,39.63 q -0.68,0.91 -1.28,-0.05 c -2.93,-4.74 -4.21,-9.67 -4.63,-15.36 q -0.45,-5.9 -1.09,-8.14 -1.89,-6.56 -4.75,-13.01 c -2.76,-6.23 -4.28,-13.06 -7.14,-19.37 -7.35,-16.19 -16.26,-33.86 -22.42,-51.48 q -0.08,-0.21 -0.01,-0.42 a 0.26,0.26 0 0 1 0.46,-0.06 q 10.77,14.73 21.98,28.77 11.5,14.4 17.6,19.88 7.55,6.77 14.86,13.4 2.74,2.48 4.97,5.3 a 1.11,1.09 32.6 0 1 0.21,0.91 z"},{"z":"quads","d":"m 300.1,836.83 q 1.64,19.12 2.22,36.73 0.11,3.47 -0.89,0.14 -2.42,-8.03 -4.58,-16.34 c -4.22,-16.26 -9.63,-31.97 -14.75,-48.34 q -2.58,-8.25 -6.48,-18.58 -14.03,-37.14 -28.05,-75.59 -3.75,-10.3 -6.6,-19.52 -5.15,-16.64 -9.78,-32.48 c -4.96,-16.95 -8.01,-35.46 -8.1,-52.91 q -0.02,-2.71 0.71,-0.1 9.47,34.09 24.55,65.57 c 6.56,13.69 13.54,27.25 19.02,40.89 q 15.49,38.57 24.83,67.42 2.41,7.47 3.31,17.16 c 1.12,12.19 3.56,24.02 4.59,35.95 z"},{"z":"quads","d":"m 338.67,872.66 c 0.73,-20.39 1.92,-38.3 4.91,-57.16 1.83,-11.53 2.14,-23.33 6.03,-34.79 q 10.93,-32.22 23.86,-64.19 c 5.7,-14.09 12.7,-27.77 19.13,-41.2 q 15.32,-32.04 24.53,-65.61 0.65,-2.39 0.64,0.08 c -0.12,28.68 -7.98,55.21 -17.34,83.63 -1.78,5.41 -3.2,10.88 -5.19,16.32 -10.25,27.99 -20.2,55.76 -30.81,83.12 q -2.8,7.2 -4.91,13.95 -5.59,17.81 -11.19,35.6 c -3.34,10.63 -5.96,21.88 -9.13,32.74 q -0.27,0.92 -0.4,-0.03 -0.18,-1.22 -0.13,-2.46 z"},{"z":"quads","d":"m 394.37,647.3 c -4.46,9.4 -9.38,19.33 -12.44,29.17 q -1.3,4.17 -2.83,7.95 c -2.26,5.61 -4.97,10.94 -5.74,16.89 -0.99,7.53 -1.06,14.75 -5.53,21.2 a 0.5,0.5 0 0 1 -0.83,0.01 q -4.34,-6.22 -7.72,-11.72 -7.96,-12.97 -11.16,-28.21 a 1.61,1.61 0 0 1 0.35,-1.37 q 2.44,-2.82 5.14,-5.21 c 9.88,-8.72 18.7,-16.83 27.48,-27.39 q 13.43,-16.14 25.97,-33.56 0.32,-0.44 0.43,-0.49 0.87,-0.39 0.54,0.51 -5.81,15.68 -13.66,32.22 z"},{"z":"quads","d":"m 352.83,748.3 c -2.02,3.67 -2.95,6.58 -2.78,11.03 q 0.26,6.53 0.21,13.72 c -0.01,1.58 -1.13,2.86 -2.75,2.9 q -0.58,0.01 -0.9,-0.48 C 342.49,769 341.27,763.08 340.41,755 q -1.04,-9.79 -2.26,-19.97 c -1.6,-13.31 -2.43,-25.65 -2.79,-38.57 q -0.03,-1.03 0.53,-1.68 a 1.21,1.2 52.6 0 1 2.01,0.27 q 6.87,14.67 13.39,28.8 2.2,4.77 3.93,9.5 1.07,2.92 0.68,5.46 -0.83,5.42 -3.07,9.49 z"},{"z":"quads","d":"m 250.69,888.3 q -16.76,-40.15 -28.04,-78.67 -9.66,-32.96 -14.75,-66.84 c -6.22,-41.38 -6.25,-81.5 4.58,-120.54 q 0.12,-0.43 0.43,-0.11 0.42,0.42 0.59,0.99 22.71,76.86 50.06,155.88 0.82,2.37 1.12,4.78 4.02,31.91 4.89,65.81 c 0.88,34.39 -0.14,66.83 -3.55,99.57 -0.42,4.08 -1.48,7.64 -3.4,11.1 a 1.74,1.74 0 0 1 -1.36,0.9 c -3.47,0.33 -9.58,0.21 -9.46,-4.63 q 0.8,-32.72 -0.01,-63.12 -0.07,-2.67 -1.1,-5.12 z"},{"z":"quads","d":"m 237.75,955.7 c -18.56,-47.89 -33.57,-96.23 -39.84,-146.62 -3.58,-28.72 -3.69,-58.65 1.76,-86.95 q 0.62,-3.18 0.81,0.06 0.5,8.53 1.83,17.04 3.42,21.88 10.35,47.5 6.6,24.41 13.5,49.26 2.72,9.81 5.92,19.09 4.05,11.74 7.55,25.02 1.76,6.7 2.16,12.33 2,28.5 1.14,55.08 c -0.12,3.52 -0.98,6.35 -3.98,8.55 a 0.79,0.79 0 0 1 -1.2,-0.36 z"},{"z":"quads","d":"m 301.11,919.16 c -0.02,16.26 -1.13,34.39 -10.87,47.81 -1.99,2.73 -6.98,1.8 -10.02,1.14 -1.09,-0.24 -1.35,-1.1 -1.62,-2.04 -3.49,-11.83 -3.03,-24.65 -1.79,-37.03 q 1.41,-14.09 3.35,-26.37 1.6,-10.13 1.54,-18.61 -0.09,-12.6 -1.48,-24.36 c -1.65,-13.85 -3.88,-27.85 -2.4,-41.77 a 0.32,0.32 0 0 1 0.4,-0.28 q 0.4,0.1 0.57,0.48 c 14.17,32.12 22.37,65.88 22.32,101.03 z"},{"z":"quads","d":"m 390.96,886.41 q -1.98,4.65 -2.04,9.09 -0.45,33.06 0.22,61.74 c 0.09,3.94 -6.78,4.21 -9.43,3.95 a 1.8,1.79 -10.8 0 1 -1.44,-0.97 c -1.51,-2.91 -2.67,-5.71 -3.07,-9.04 q -1.93,-16.27 -2.84,-32.46 c -2.55,-44.99 -1.64,-90.5 3.77,-134.26 q 0.37,-2.95 1.26,-5.54 26.45,-76.29 50.24,-156.54 a 0.39,0.38 21.6 0 1 0.55,-0.23 q 0.31,0.16 0.41,0.51 c 10.18,37.82 10.57,76.54 5.14,115.55 q -4.46,32.04 -13.33,63.85 -12.28,44.03 -29.44,84.35 z"},{"z":"quads","d":"m 441.32,723.15 q 5.4,27.88 3.91,59.43 c -1.5,31.66 -7.16,62.78 -15.56,93.66 q -10.93,40.18 -26.56,79.46 a 0.8,0.8 0 0 1 -1.23,0.34 c -4.09,-3.18 -3.84,-7.55 -3.96,-12.09 q -0.59,-24.2 1.07,-50.23 0.42,-6.4 2.05,-12.77 3.38,-13.22 8.06,-26.98 3.21,-9.44 5.93,-19.09 c 7.96,-28.15 15.34,-53.97 20.99,-81.11 q 3.3,-15.87 4.53,-32.62 0.01,-0.1 0.11,-0.14 l 0.25,-0.09 q 0.11,-0.04 0.12,0.07 0.06,0.98 0.29,2.16 z"},{"z":"quads","d":"m 350.02,966.12 c -9.24,-14.15 -10.21,-31.4 -10.24,-48.19 -0.07,-33.99 8.51,-69.02 22.57,-100.06 a 0.51,0.49 -76.6 0 1 0.45,-0.29 q 0.28,0 0.31,0.28 c 0.83,7.48 0.62,15.88 -0.25,23.21 -1.72,14.59 -3.74,28.99 -3.61,44.11 q 0.06,8 1.44,16.9 1.82,11.87 3.26,24.93 c 1.49,13.54 2.18,28.24 -1.97,40.04 a 1.57,1.55 2.7 0 1 -1.11,1 q -3.84,0.9 -7.13,0.61 -2.19,-0.19 -3.72,-2.54 z"},{"z":"base","d":"m 258.39,1012.52 q -5.64,-13.48 -7.66,-29.52 -0.05,-0.4 0.28,-0.64 10.7,-7.7 22.82,-4.11 c 5.29,1.57 4.59,5.57 4.3,9.79 -0.9,12.75 -3.27,25.99 -10.59,36.26 a 1.05,1.05 0 0 1 -1.64,0.09 q -4.73,-5.21 -7.51,-11.87 z"},{"z":"base","d":"m 258.71,1030.63 c 3.61,6.97 7.98,15.68 6.95,23.65 a 0.48,0.48 0 0 1 -0.72,0.35 l -18.34,-11.02 q -0.38,-0.23 -0.55,-0.64 -1,-2.44 -1.32,-4.76 -3.61,-26.35 -4.29,-51.87 -0.06,-2.2 0.39,-0.04 c 3.24,15.52 10.35,29.77 17.88,44.33 z"},{"z":"base","d":"m 288.4,985.22 q 1.73,22.58 1.26,41.7 -0.04,1.47 -0.76,3.07 -4.6,10.16 -10.25,24.15 c -2.27,5.6 -3.1,11.54 -5.89,17 q -0.2,0.39 -0.5,0.07 -0.38,-0.42 -0.45,-1 c -1.47,-12.75 1.68,-26.74 4.89,-38.94 4.36,-16.65 9.53,-33.85 10.59,-51.47 q 0.01,-0.22 0.19,-0.33 0.05,-0.02 0.1,-0.02 0.14,0.02 0.16,0.16 0.44,2.76 0.66,5.61 z"},{"z":"base","d":"m 367.17,978.19 c 7.47,-2.33 16.25,-0.86 22.63,4.13 q 0.45,0.35 0.38,0.92 -1.87,15.08 -7.33,28.55 -2.94,7.24 -7.89,12.74 a 0.87,0.87 0 0 1 -1.34,-0.05 c -8.34,-10.84 -10.82,-27.73 -10.91,-41.25 -0.01,-2.65 2.18,-4.32 4.46,-5.04 z"},{"z":"base","d":"m 369.06,1070.47 q -0.22,1.65 -1.01,0.18 c -2.79,-5.17 -3.42,-10.89 -5.57,-16.11 q -5.2,-12.65 -10.53,-24.91 c -0.38,-0.88 -0.8,-1.93 -0.81,-2.92 q -0.26,-23.13 1.85,-46.89 a 0.27,0.26 -77 0 1 0.36,-0.23 l 0.25,0.11 q 0.13,0.05 0.14,0.19 0.36,9.87 2.31,18.26 4.17,17.95 9.24,37.46 c 3.02,11.63 5.3,23.46 3.77,34.86 z"},{"z":"base","d":"m 378.49,1038.47 q 5.25,-11 11.25,-23 6.8,-13.59 10.56,-29.93 0.03,-0.15 0.18,-0.19 0.05,-0.01 0.1,0 0.1,0.01 0.09,0.11 -0.84,19 -2.62,37.31 -1.13,11.63 -2.64,19.1 -0.25,1.26 -1.49,1.99 -10.01,5.93 -17.84,10.76 a 0.53,0.53 0 0 1 -0.8,-0.37 c -0.79,-5.16 1.07,-11.29 3.21,-15.78 z"},{"z":"calves","d":"m 260.21,1135.29 c 4.48,29.68 7.59,58.82 9.36,87.72 0.53,8.66 1.47,17.39 2.79,25.97 q 1.84,11.96 7.34,33.23 0.5,1.94 1.04,7.01 0.48,4.54 -2.34,7.74 a 0.6,0.6 0 0 1 -0.99,-0.15 q -1.61,-3.47 -2.33,-7.07 -5.47,-27.17 -8.25,-45.03 -4.18,-26.84 -7.6,-47.71 -0.97,-5.95 -2.27,-12 -7.08,-33.02 -14.69,-65.86 -1.12,-4.84 -2.44,-9.69 -1.98,-7.22 -2.28,-9.76 -2.41,-20.6 1.44,-43.08 0.25,-1.46 0.73,-0.06 7.12,20.57 13.32,44.54 4.83,18.73 7.17,34.2 z"},{"z":"calves","d":"m 367.02,1257.45 q 3.27,-15.94 4.47,-35.75 2.4,-39.61 7.94,-77.98 2.44,-16.87 5.47,-30.17 6.3,-27.69 16.13,-56.67 0.69,-2.03 1.04,0.08 2.43,14.55 2.2,31.01 -0.15,10.91 -2.78,20.08 -1.29,4.53 -2.34,9.1 -7.34,31.94 -13.88,61.81 -2.12,9.66 -3.56,18.43 c -4.93,29.99 -9.41,60.77 -15.76,91.85 q -0.74,3.61 -2.23,7.21 a 0.86,0.86 0 0 1 -1.48,0.19 q -2.35,-3.11 -2.05,-7.14 0.36,-4.83 1.56,-9.43 3.01,-11.58 5.27,-22.62 z"},{"z":"calves","d":"m 273.89,1099.95 c 3.37,-15.16 7.39,-30.47 12.61,-44.88 q 0.67,-1.85 1.28,0.01 4.41,13.38 7.29,29.13 3.29,18.03 6.8,44.66 2.68,20.36 2.76,35.74 0.04,6.36 -1.26,13.77 -3.67,20.9 -7.39,37.94 -6.52,29.95 -12.99,57.95 -0.31,1.31 -0.67,0.01 -3.32,-11.98 -5.27,-24.29 -5.82,-36.85 -4.93,-74.51 c 0.46,-19.33 0.09,-35.61 0.04,-57.98 q -0.03,-9.65 1.73,-17.55 z"},{"z":"calves","d":"m 272.32,1289.43 q 0.14,1.3 -0.7,0.3 -1.96,-2.32 -3.31,-4.94 -4.85,-9.47 -8.79,-20.24 -9.58,-26.21 -15.83,-53.09 -1,-4.3 -2.77,-8.19 c -8,-17.6 -12.77,-36.6 -13.83,-55.89 q -1.45,-26.23 4.89,-54.26 0.41,-1.85 1,-0.05 1.2,3.7 2.35,7.92 c 6.05,22.14 11.41,47.6 16.75,71.19 q 2.42,10.71 3.46,19.48 2.54,21.38 5.09,39.58 c 2.14,15.29 4.57,31.52 9.27,46.7 q 1.76,5.67 2.42,11.49 z"},{"z":"calves","d":"m 351.12,1061.47 q 0.86,-3.24 2.27,-6.95 a 0.37,0.37 0 0 1 0.67,-0.04 q 0.6,1.15 1.07,2.55 4.5,13.38 8.77,29.36 3.17,11.88 4.35,21.44 0.65,5.26 0.58,16.16 c -0.12,17.19 -0.49,33.53 -0.01,50.26 q 0.96,33.46 -3.97,69.04 -2.3,16.62 -6.18,31.23 -0.05,0.18 -0.19,0.29 a 0.25,0.25 0 0 1 -0.39,-0.14 c -7.63,-32.4 -14.66,-63.57 -20.38,-95.86 q -1.46,-8.28 -1.39,-15.2 0.13,-12.7 1.63,-25.36 c 2.86,-24.12 6.38,-51.37 13.17,-76.78 z"},{"z":"calves","d":"m 400.56,1202.06 c -1.03,2.29 -2.11,4.68 -2.7,7.11 -5.58,23.36 -12.43,46.15 -21.19,67.15 q -3.13,7.49 -7.08,13.12 -0.19,0.27 -0.47,0.44 -0.68,0.4 -0.57,-0.38 0.79,-5.61 2.43,-11.29 5.47,-18.91 8.27,-39.41 3.36,-24.7 6.32,-48.64 1.04,-8.33 3.58,-19.59 5.82,-25.8 11.4,-49.84 3.49,-14.99 7.21,-27.24 0.18,-0.58 0.63,-1.01 0.33,-0.31 0.43,0.13 c 8.56,36.96 7.32,74.95 -8.26,109.45 z"},{"z":"base","d":"m 279.42,1326.07 q -2.66,-6.02 -11.2,-17.08 -1.56,-2.02 -1.72,-4 c -0.22,-2.73 1.78,-5.75 4.12,-7.13 q 0.49,-0.29 0.97,0.02 8.39,5.34 14.89,11.86 1.95,1.97 2.11,4.51 0.86,13.41 -1.46,27.53 a 0.31,0.31 0 0 1 -0.45,0.22 q -0.14,-0.08 -0.27,-0.19 -0.12,-0.1 -0.18,-0.24 -3.39,-7.76 -6.81,-15.5 z"},{"z":"base","d":"m 284.58,1349.02 q 5.05,11.98 7,21.38 3.39,16.32 -0.69,32.76 a 0.43,0.43 0 0 1 -0.76,0.16 c -10.12,-13.11 -21.17,-25.72 -34.11,-35.39 a 1.63,1.62 16.1 0 1 -0.65,-1.17 q -0.75,-8.89 2.46,-14.38 0.98,-1.67 1.18,-3.55 1.38,-12.95 2.87,-26.6 a 0.7,0.7 0 0 1 0.91,-0.59 c 11.21,3.6 17.28,16.67 21.79,27.38 z"},{"z":"base","d":"m 353.36,1339.65 q -1.77,-13.46 -1.06,-24.75 0.06,-0.96 0.22,-1.92 c 0.7,-4.2 12.74,-12.42 16.33,-14.86 q 1.07,-0.72 2.08,0.08 c 3.24,2.56 4.92,6.49 2.19,10.15 -5.11,6.84 -9.99,13.59 -13.3,21.5 q -2.27,5.41 -5.06,11.31 -0.76,1.62 -1.15,-0.12 -0.15,-0.68 -0.25,-1.39 z"},{"z":"base","d":"m 379.01,1322.5 c 1.17,9.01 1.97,18.19 3.1,26.72 0.13,0.98 0.26,1.92 0.78,2.79 q 3.21,5.33 2.84,13.44 -0.1,2.05 -1.78,3.29 c -12.07,8.93 -22.71,21.31 -32.45,33.67 q -0.48,0.61 -1.15,0.95 a 0.24,0.24 0 0 1 -0.34,-0.16 q -5.23,-21.38 1.99,-42.64 2.82,-8.31 6.7,-16.77 c 4.2,-9.17 9.45,-18.49 19,-22.07 a 0.98,0.97 -14.1 0 1 1.31,0.78 z"},{"z":"base","d":"m 268.26,1427.94 c -13.55,0.97 -28,-0.1 -40.94,-5.21 a 0.76,0.76 0 0 1 -0.35,-1.14 c 8.83,-12.76 18.97,-25.24 27.65,-37.39 q 0.72,-1 1.89,-0.61 11.12,3.76 18.81,14.19 c 1.66,2.25 0.2,9.63 -0.4,12.23 q -2.17,9.25 -5.67,17.23 a 1.19,1.17 -79.8 0 1 -0.99,0.7 z"},{"z":"base","d":"m 279.15,1427.43 c -2.43,-4.43 -2.1,-22.42 2.82,-25.6 q 0.48,-0.31 0.93,0.02 c 4.5,3.21 11.09,10.03 10.33,15.88 q -0.43,3.39 -0.54,7.02 a 3.3,3.3 0 0 1 -3.32,3.21 l -9.41,-0.05 q -0.55,0 -0.81,-0.48 z"},{"z":"base","d":"m 382.04,1384.42 q 1.51,-0.66 3.03,-0.87 0.57,-0.07 0.91,0.39 l 27.73,37.1 a 1.23,1.22 61 0 1 -0.53,1.87 c -12.37,4.87 -27.24,6.04 -40.29,5.05 a 1.5,1.49 81 0 1 -1.27,-0.93 c -3.14,-7.8 -6.11,-16.5 -6.82,-25.44 q -0.2,-2.47 0.96,-4.02 6.68,-8.97 16.28,-13.15 z"},{"z":"base","d":"m 347.64,1416.45 c -0.34,-4.76 6.41,-11.73 10.12,-14.46 a 1.41,1.4 -37.2 0 1 1.94,0.26 c 2.44,3.09 2.86,7.16 3.19,10.93 q 0.6,6.77 -0.53,13.21 a 1.96,1.95 5.2 0 1 -1.95,1.62 l -9.39,-0.1 a 2.74,2.74 0 0 1 -2.7,-2.53 q -0.35,-4.33 -0.68,-8.93 z"}],"femaleBack":[{"z":"base","d":"m 1096.04,0 h 7.79 c 22.49,2.45 53.18,10.99 60.21,36.27 q 0.46,1.66 2,2.05 c 64.38,16.44 60.01,99.49 44.24,147.61 q -2.62,7.99 -6.55,14.81 -0.51,0.89 -1.22,1.68 -0.97,1.07 -1.52,1.32 -3.63,1.58 -6.55,2.8 -14.77,6.1 -29.14,11 -0.74,0.26 -0.59,1.19 -0.52,-0.76 -1.47,-0.46 -4.4,1.42 -10.86,2.97 -3.97,1 -6.62,1.12 -5.28,0.24 -12.66,-0.36 -5.76,-0.52 -11.15,-2.21 -0.54,-0.17 -0.85,-0.03 -0.45,0.2 -0.58,0.77 0.26,-1.02 -0.52,-1.24 -9.76,-2.78 -19.21,-7.04 a 0.46,0.46 0 0 0 -0.65,0.43 l 0.39,12.23 q 0.49,15.83 -0.42,30.63 l -0.91,9.16 a 2.42,2.42 0 0 1 -1.99,2.15 q -11.5,2.06 -22.86,2.63 -5.84,0.05 -10.69,-1.12 -4.96,-1.19 -7,-1.31 -3.7,-0.23 -7.48,-0.12 -17.27,0.5 -33.97,1.33 -7.72,0.38 -15.15,-0.74 a 2.13,2.12 0.2 0 1 -1.78,-1.78 c -1,-6.77 1.75,-15.8 4.22,-22.15 q 5.88,-15.15 12.89,-32.55 c 7.85,-19.49 14.27,-41.02 13.35,-61.3 q -1.03,-22.68 -5.37,-57.36 -0.67,-5.33 -0.4,-10.31 0.98,-18.63 7.84,-37.04 5.87,-15.78 15.35,-24.54 c 7.92,-7.32 19.98,-14.55 31.09,-17.67 q 9.1,-2.55 18.79,-2.82 z m 40.66,79.56 c 15.08,3.29 29.45,-7.8 30.48,-23.26 q 0.15,-2.22 -0.63,-0.14 -6.61,17.62 -24.72,17.97 c -5.78,0.12 -11.81,-2.36 -16.39,-6.42 -1.53,-1.35 -3.74,-3.16 -5.84,-2.98 a 0.62,0.62 0 0 0 -0.5,0.9 q 5.86,11.37 17.6,13.93 z"},{"z":"base","d":"m 1167.18,56.3 c -1.03,15.46 -15.4,26.55 -30.48,23.26 Q 1124.96,77 1119.1,65.63 a 0.62,0.62 0 0 1 0.5,-0.9 c 2.1,-0.18 4.31,1.63 5.84,2.98 4.58,4.06 10.61,6.54 16.39,6.42 q 18.11,-0.35 24.72,-17.97 0.78,-2.08 0.63,0.14 z"},{"z":"base","d":"m 1133.1,222 -1.89,61.8 q -0.02,0.66 -0.62,0.4 -22.28,-9.35 -45.91,-9.91 a 0.77,0.77 0 0 1 -0.6,-1.22 q 1.38,-1.89 3.31,-2.48 c 6.78,-2.07 12.31,-3.9 18.36,-8.33 q 5.08,-3.71 7.66,-8.78 c 5.15,-10.11 6.3,-21.91 7.11,-32.95 q 0.13,-0.57 0.58,-0.77 0.31,-0.14 0.85,0.03 5.39,1.69 11.15,2.21 z"},{"z":"base","d":"m 1164.71,218.73 c 1.42,12.25 1.86,24.62 7.81,35.59 3.46,6.38 11.4,11.41 17.38,13.62 q 4.31,1.6 8.68,2.96 1.85,0.58 2.75,2.35 a 0.65,0.65 0 0 1 -0.56,0.94 q -23.87,0.79 -45.98,10.03 a 0.34,0.34 0 0 1 -0.47,-0.3 l -1.94,-62.68 q 6.46,-1.55 10.86,-2.97 0.95,-0.3 1.47,0.46 z"},{"z":"back","d":"m 1135.46,406.92 c -18.92,-8.6 -32.13,-23.67 -41.02,-42.55 q -5.92,-12.58 -12.01,-29.57 c -8.17,-22.8 -18.79,-46.58 -45.58,-51.11 q -2.73,-0.46 -0.13,-1.41 4.88,-1.81 11.29,-2.14 31.93,-1.68 62.2,8.18 c 8.7,2.84 17.39,6.76 24.41,12.87 q 2.26,1.96 2.37,4.56 c 1.34,31.32 1.02,63.51 1.17,95.68 q 0.01,2.48 -0.9,4.77 -0.52,1.31 -1.8,0.72 z"},{"z":"back","d":"m 1207.43,323.66 c -6.47,16.09 -12.05,33.31 -20.26,48.12 q -13.47,24.27 -37.07,35.13 a 1.54,1.53 -20.3 0 1 -2.12,-0.97 q -0.48,-1.66 -0.5,-3.37 -0.3,-43.8 0.71,-95.35 c 0.05,-2.69 0.7,-4.25 2.8,-6.09 q 6.04,-5.32 13.64,-8.64 c 21.78,-9.51 47.77,-13.62 71.23,-12.54 4.41,0.2 9.17,0.92 13.49,2.46 q 1.76,0.62 -0.05,1.06 c -2.97,0.73 -5.89,1.25 -8.8,2.31 -17.14,6.22 -26.43,21.36 -33.07,37.88 z"},{"z":"shoulders","d":"m 1015.26,291.32 c 13.82,-8.28 31.54,1.05 42.43,10.31 a 0.79,0.78 46.2 0 1 -0.02,1.22 c -24.49,19.25 -48.03,41.91 -64.52,68.41 q -0.81,1.29 -0.91,-0.22 c -0.55,-8.02 -1.66,-16.16 -1.47,-24.04 q 0.34,-14.94 4.17,-28.72 4.91,-17.72 20.32,-26.96 z"},{"z":"shoulders","d":"m 1269.98,290.8 c 13.79,8.38 20.48,19.55 22.26,34.89 1.11,9.5 1.29,18.77 0.46,28.54 q -0.73,8.56 -1.29,17.08 -0.08,1.29 -0.8,0.22 c -16.86,-25.21 -37.38,-47.58 -59.38,-68.88 q -0.46,-0.45 0,-0.88 c 9.46,-8.91 18.65,-15.05 32.34,-13.43 2.34,0.28 4.42,1.25 6.41,2.46 z"},{"z":"back","d":"m 1076.09,338.19 q 6.08,14 8.04,30.55 0.06,0.58 -0.52,0.57 -11.77,-0.05 -23.32,-2.12 -15.59,-2.79 -31.04,-5.99 a 1.37,1.36 12.9 0 1 -1.05,-1.66 c 4.67,-18.66 16.53,-35.54 33.45,-45.02 a 0.84,0.83 59.5 0 1 1.11,0.29 c 4.8,7.66 9.75,15.13 13.33,23.38 z"},{"z":"back","d":"m 1136.59,472.49 c -4.61,16.03 -15.02,30.53 -26.92,42.6 q -13.41,13.6 -29.37,25.62 -0.65,0.5 -0.73,-0.32 -5.92,-63.46 -22.92,-123.09 -4.96,-17.4 -9.99,-34.68 a 0.7,0.7 0 0 1 0.74,-0.89 q 8.92,0.83 16.32,1.52 10.81,1.01 19.97,-4.41 0.54,-0.32 1,0.1 1.78,1.59 3.48,3.41 22.52,24.07 30.7,32.06 7.98,7.79 16.19,14.02 0.79,0.6 1.05,1.52 6.33,22.2 0.48,42.54 z"},{"z":"back","d":"m 1208.41,340.35 c 3.56,-8.92 9.08,-17.44 14.24,-25.41 a 0.92,0.91 29.5 0 1 1.18,-0.32 c 16.77,8.66 28.69,26.73 33.4,44.65 q 0.44,1.67 -1.25,2 c -18.03,3.6 -36.04,7.81 -54.02,8.1 q -0.68,0.01 -0.6,-0.67 1.86,-15.33 7.05,-28.35 z"},{"z":"back","d":"m 1238.86,382.59 c -6.36,21.96 -12.97,44.37 -18.07,65.96 q -10.8,45.75 -14.79,91.85 a 0.46,0.46 0 0 1 -0.74,0.33 Q 1184.28,525.02 1169.34,508 c -8.23,-9.38 -15.46,-20.54 -19.54,-32.61 q -6.78,-20.06 -1.17,-43.01 c 0.49,-1.99 0.83,-3.24 2.53,-4.57 17.75,-13.89 33.26,-32.01 49.33,-48.67 q 0.64,-0.67 1.43,-0.19 9.01,5.38 20.51,4.24 7.75,-0.76 15.78,-1.39 a 0.62,0.62 0 0 1 0.65,0.79 z"},{"z":"back","d":"m 1068.62,544.21 c 7.96,11.18 10.18,25.23 10.98,38.79 a 1.16,1.16 0 0 1 -0.56,1.06 l -18.13,10.62 a 0.4,0.39 -13.5 0 1 -0.6,-0.36 q 1.04,-16.62 2.69,-32.09 0.79,-7.45 2.8,-14.26 0.6,-2.03 1.74,-3.74 a 0.66,0.65 -45.9 0 1 1.08,-0.02 z"},{"z":"back","d":"m 1133.23,596.5 c -0.34,6.54 -1.25,13 -1.82,19.57 q -0.07,0.85 -0.6,0.17 -3.62,-4.73 -6.59,-7.98 -9.72,-10.63 -18.63,-20.4 -12.89,-14.11 -23.33,-31.15 a 0.57,0.57 0 0 1 0.2,-0.78 q 7.87,-4.59 14.81,-11.15 c 12.33,-11.64 23.63,-24.56 35.33,-36.99 q 0.87,-0.93 0.88,0.34 c 0.19,29.32 1.27,58.9 -0.25,88.37 z"},{"z":"back","d":"m 1199.62,562.36 c -10.91,16.62 -23.7,30.13 -37.46,44.84 q -3.74,4 -7.34,8.9 -0.68,0.93 -0.82,-0.22 c -1.8,-15.45 -2.6,-31.26 -2.53,-47.01 q 0.14,-30.97 0.58,-60.87 0.02,-1.16 0.8,-0.31 13.63,14.85 25.73,27.71 7.18,7.63 15.56,14.48 4.25,3.47 8.77,5.95 0.51,0.27 0.23,0.78 -1.61,2.85 -3.52,5.75 z"},{"z":"back","d":"m 1205.91,583.12 c 0.67,-13.86 3,-27.66 11.11,-39.08 a 0.57,0.57 0 0 1 0.96,0.06 q 1.93,3.49 2.75,7.64 c 2.78,13.99 3.44,28.55 4.52,42.69 a 0.37,0.36 13.1 0 1 -0.55,0.34 l -18.27,-10.7 a 1.05,1.04 16.6 0 1 -0.52,-0.95 z"},{"z":"triceps","d":"m 976.72,479.34 q -0.46,-17.73 -0.59,-32.11 c -0.22,-24.28 5.62,-47.43 19.17,-67.7 q 0.38,-0.55 0.24,0.1 -9.84,49.08 -17.78,99.12 a 0.83,0.82 -4 0 1 -0.58,0.66 l -0.25,0.08 q -0.21,0.06 -0.21,-0.15 z"},{"z":"triceps","d":"m 990.45,481.03 c -2.39,-3.13 -3.03,-8.64 -3.15,-12.61 q -0.81,-26.18 5.96,-50.71 a 0.37,0.37 0 0 1 0.61,-0.17 q 0.16,0.15 0.19,0.37 c 2.18,16.06 4.1,31.34 3.14,46.56 -0.33,5.2 -1.01,12.19 -4.17,16.53 a 1.61,1.61 0 0 1 -2.58,0.03 z"},{"z":"triceps","d":"m 1028.38,422.24 c 0.27,25.48 -7.52,49.09 -23.37,68.41 q -1.16,1.41 -0.93,-0.4 0.44,-3.53 0.41,-7.83 -0.06,-10.3 -1.3,-22.14 -2.2,-20.98 -3.39,-41.99 -0.61,-10.99 0.7,-23.78 c 1.65,-15.98 6.95,-30.6 19.9,-39.63 a 0.42,0.41 73.8 0 1 0.65,0.36 q -0.32,8.22 1.06,16.55 c 2.81,16.86 6.09,33.63 6.27,50.45 z"},{"z":"triceps","d":"m 1281,491.32 c -15.93,-19.27 -23.98,-42.53 -23.89,-67.9 q 0.04,-11.8 1.5,-21.9 2.13,-14.76 4.78,-30.03 1.39,-8.03 1.05,-16.2 a 0.44,0.44 0 0 1 0.7,-0.38 c 15.59,11.17 19.78,29.71 20.57,48.58 q 0.43,10.46 -0.35,21.17 -1.37,18.51 -3.48,40.31 -1.27,13.12 -0.53,26.21 0.03,0.6 -0.35,0.14 z"},{"z":"triceps","d":"m 1290.47,379.83 c 11.24,17.52 17.33,36.08 18.47,57.41 0.75,14.09 0.07,27.95 0.05,41.97 a 0.28,0.28 0 0 1 -0.41,0.24 l -0.26,-0.14 q -0.65,-0.34 -0.76,-1.06 -7.8,-49.99 -17.59,-98.21 -0.29,-1.43 0.5,-0.21 z"},{"z":"triceps","d":"m 1291.39,418.15 q 0.03,-0.24 0.18,-0.46 0.48,-0.71 0.7,0.12 6.89,26.33 5.89,50.76 c -0.16,3.99 -0.69,8.84 -2.91,12.24 a 1.69,1.68 -51.8 0 1 -2.56,0.31 c -2.76,-2.6 -3.77,-9.43 -4.13,-13.42 -1.44,-16.19 0.36,-32.39 2.83,-49.55 z"},{"z":"forearms","d":"m 930.6,575.85 q 12.51,-34.52 28.14,-65.44 0.43,-0.86 0.47,0.1 c 0.49,12.97 -1.54,25.43 -3.91,38.74 -2.51,14.09 -8.58,26.84 -13.42,40.42 q -1.72,4.85 -6.72,12.65 -6.65,10.39 -13.96,19.24 -0.97,1.19 -0.94,-0.34 0.15,-6.74 1.54,-13.78 3.2,-16.15 8.8,-31.59 z"},{"z":"forearms","d":"m 941.59,538.06 c -10.38,28.73 -19.89,57.37 -27.03,86.93 q -2.23,9.27 -3.43,18.85 -0.08,0.65 -0.71,0.78 -2.96,0.63 -5.97,-0.23 c -6.64,-1.91 -6.12,-8.24 -4.18,-13.33 q 16.12,-42.22 33.46,-84.93 5.37,-13.2 12.03,-26.13 2.79,-5.42 6.2,-10.06 1.45,-1.95 0.5,0.29 -5.71,13.57 -10.87,27.83 z"},{"z":"forearms","d":"m 975.21,499.01 c 1.84,-4.34 5.3,-10.94 10.55,-11.69 3.15,-0.45 8.93,-1.45 11.43,0.58 q 3.23,2.63 1.33,6.34 -3.58,7.04 -8.39,12.41 -7.93,8.86 -17.96,19.2 a 0.33,0.32 -34.8 0 1 -0.53,-0.09 q -1.15,-2.76 -1.06,-6.04 0.31,-10.51 4.63,-20.71 z"},{"z":"forearms","d":"m 999.09,525.32 q -17.79,35.36 -41.48,67.79 c -7.52,10.28 -15.96,20.81 -26,28.74 a 0.38,0.38 0 0 1 -0.53,-0.06 q -0.12,-0.14 -0.06,-0.3 11.88,-29.53 23.3,-54.73 6.13,-13.51 13.08,-26.59 3.39,-6.37 7.64,-12.19 c 1.13,-1.54 2.35,-1.94 4.17,-1.93 q 4.02,0.02 8.07,0.22 c 3.63,0.18 9.88,-4.42 13.11,-6.8 0.2,-0.14 0.64,-0.23 0.88,-0.2 a 0.39,0.39 0 0 1 0.32,0.53 q -1.15,2.82 -2.5,5.52 z"},{"z":"forearms","d":"m 1287.36,495.1 q -0.66,-1.22 -1,-2.61 c -0.91,-3.66 3.19,-5.9 6.21,-5.78 q 4.25,0.16 7.87,0.8 c 8.25,1.44 13.07,19.85 14.04,26.73 q 0.78,5.48 -0.26,11.26 a 0.58,0.57 -61.9 0 1 -0.98,0.3 q -8.13,-8.44 -16.02,-16.95 -5.71,-6.16 -9.86,-13.75 z"},{"z":"forearms","d":"m 1374.91,644.61 a 0.63,0.62 -88.1 0 1 -0.49,-0.53 q -1.21,-9.55 -3.48,-19.07 c -6.9,-28.95 -17.02,-59.28 -27.49,-88.05 q -4.81,-13.23 -10.53,-26.85 -0.87,-2.08 0.48,-0.27 2.91,3.89 5.26,8.23 6.11,11.31 10.9,22.92 19.34,46.92 36.37,92.34 1.24,3.29 0.04,6.8 c -1.45,4.24 -7.09,5.35 -11.06,4.48 z"},{"z":"forearms","d":"m 1326.82,510.35 c 12.89,26.28 24.62,53.47 32.98,80.83 q 4.59,15.02 5.5,30.08 0.09,1.54 -0.91,0.36 -9.8,-11.56 -17.28,-24.72 -2.96,-5.2 -5.36,-12.12 -2.76,-7.98 -6.01,-15.96 c -4.29,-10.55 -5.9,-21.36 -7.75,-32.59 q -2.18,-13.15 -1.71,-25.77 0.04,-1.12 0.54,-0.11 z"},{"z":"forearms","d":"m 1354.08,620.73 q 0.96,2.42 -1,0.71 -9.65,-8.41 -17.52,-18.38 -24.99,-31.7 -45.4,-70.39 -3.25,-6.15 -6.17,-12.68 -0.09,-0.2 -0.03,-0.4 a 0.51,0.51 0 0 1 0.78,-0.29 c 4.23,2.88 9.9,7.54 15.41,6.95 q 3.07,-0.34 6.17,-0.24 c 1.9,0.05 3.28,0.57 4.42,2.2 7.5,10.74 13.36,23.21 18.79,35.06 q 12.91,28.18 24.55,57.46 z"},{"z":"base","d":"m 848.29,759.36 c -5.06,1.08 -7.66,-1.55 -5.81,-6.56 6.01,-16.27 11.17,-30.37 18.43,-44.8 q 1.12,-2.22 3.5,-1.5 l 0.45,0.14 a 3.88,3.87 16.7 0 1 2.59,4.81 c -4.79,16.16 -11.42,31.25 -18.02,46.96 a 1.59,1.57 -84.6 0 1 -1.14,0.95 z"},{"z":"base","d":"m 847.54,670.63 q 10.11,-7.1 20.43,-14.71 c 1.82,-1.34 3.93,-1.24 5.61,0.25 q 1.28,1.14 0.18,2.44 -14.63,17.34 -36.12,26.57 -2.85,1.23 -6.59,0.27 -0.66,-0.17 -1.22,-0.56 -2.78,-1.93 0.1,-3.71 c 5.74,-3.54 11.89,-6.53 17.61,-10.55 z"},{"z":"base","d":"m 857.95,703.24 c -4.4,13.3 -9.63,25.8 -16.79,37.33 q -1.72,2.78 -4.23,4.64 a 1.09,1.09 0 0 1 -1.74,-0.77 c -1.48,-16.04 8.92,-33.06 16.88,-46.35 q 0.57,-0.95 1.66,-0.8 c 2.95,0.39 5.23,2.88 4.22,5.95 z"},{"z":"base","d":"m 875.79,722.55 c -4.07,11.58 -8.41,22.82 -15.01,33 q -1.32,2.03 -3.6,3.48 -0.5,0.32 -0.97,-0.05 c -2.61,-2.08 -1.53,-6.69 -0.45,-9.36 q 5.27,-13.01 10.45,-25.43 1.81,-4.36 4.29,-8.03 0.62,-0.92 1.74,-0.88 c 4.7,0.15 4.82,3.66 3.55,7.27 z"},{"z":"base","d":"m 887.56,727.64 q -3.99,9.72 -9.96,19.13 -0.8,1.27 -2.1,1.97 a 0.74,0.74 0 0 1 -1.08,-0.76 q 1.91,-12.47 8.14,-23.5 2.02,-3.58 4.82,-5.9 a 0.94,0.94 0 0 1 1.47,0.36 c 1.15,2.7 -0.24,6.15 -1.29,8.7 z"},{"z":"base","d":"m 902.05,654.63 c 1.72,20.81 -0.74,43.2 -13.83,59.63 -1.5,1.87 -3.8,1.35 -5.78,0.55 q -7.06,-2.82 -10.22,-9.71 c -0.79,-1.73 -2.34,-3.24 -3.92,-4.25 q -5.99,-3.87 -10.35,-8.32 a 2.19,2.18 28.4 0 1 -0.59,-1.97 q 1.69,-8.62 7.46,-16.29 7.41,-9.85 18.48,-23.61 0.37,-0.46 0.96,-0.45 8.59,0.19 16.75,3.06 a 1.58,1.57 -82.5 0 1 1.04,1.36 z"},{"z":"base","d":"m 1390.47,703.5 c -7.03,-15.23 -8.6,-32.38 -6.98,-49.44 a 0.84,0.84 0 0 1 0.55,-0.71 q 8.24,-2.9 16.94,-3.13 a 1.84,1.82 -19.6 0 1 1.51,0.71 q 7.66,9.84 15.58,19.76 7.56,9.46 9.92,18.85 c 0.44,1.72 -0.22,3.09 -1.51,4.23 q -4.73,4.18 -10.02,7.65 -2.13,1.39 -3.17,3.63 c -2.09,4.49 -5.23,7.65 -10.01,9.66 q -2.32,0.97 -4.45,0.69 -0.49,-0.06 -0.83,-0.42 -4.41,-4.73 -7.53,-11.48 z"},{"z":"base","d":"m 1434.6,668.37 q 8.2,5.82 20.84,12.66 3.02,1.63 0.3,3.74 -0.49,0.38 -1.08,0.56 -3.68,1.1 -6.72,-0.17 -21.61,-9.06 -36.36,-26.82 -0.91,-1.09 0.16,-2.02 c 2.56,-2.23 4.17,-1.59 6.69,0.28 q 8.2,6.11 16.17,11.77 z"},{"z":"base","d":"m 1440.18,733.51 c -5.02,-9.9 -10.12,-20.82 -13.01,-31.69 q -0.15,-0.58 0.1,-1.13 1.52,-3.24 4.84,-3.48 0.7,-0.05 1.06,0.55 c 8.34,13.8 18.29,30.28 17.05,46.84 a 0.97,0.97 0 0 1 -1.49,0.74 c -3.56,-2.27 -6.64,-8.06 -8.55,-11.83 z"},{"z":"base","d":"m 1431.61,747.81 q -8.05,-18.9 -13.4,-35.42 -0.77,-2.34 0.9,-4.93 0.26,-0.41 0.73,-0.64 3.35,-1.63 4.67,0.91 3.49,6.76 6.36,13.86 6.23,15.39 12.52,32.24 c 1.04,2.81 0.09,4.43 -2.57,5.47 q -3.87,1.52 -5.42,-2.33 -1.86,-4.6 -3.79,-9.16 z"},{"z":"base","d":"m 1409.03,720.33 c -1.15,-3.85 4.48,-7.35 6.5,-3.44 1.02,1.99 2.25,3.91 3.11,5.95 q 5.89,13.98 11.33,27.6 1.3,3.26 0.57,7.15 a 1.77,1.77 0 0 1 -2.76,1.12 c -3.33,-2.36 -6.22,-7.81 -8.08,-11.63 -4.21,-8.63 -7.92,-17.55 -10.67,-26.75 z"},{"z":"base","d":"m 1407.92,746.8 c -4.19,-6.47 -7.65,-13.37 -10.63,-20.61 q -1.4,-3.4 -0.83,-7.06 a 0.95,0.94 -66.3 0 1 1.52,-0.6 q 2.67,2.14 4.37,5.02 6.61,11.16 8.73,24.5 a 0.6,0.6 0 0 1 -0.81,0.65 q -1.51,-0.6 -2.35,-1.9 z"},{"z":"glutes","d":"m 1031.34,630.56 q 8.17,-17.96 22.15,-29.52 0.57,-0.47 1.35,-0.78 c 0.63,-0.25 1.17,-0.54 1.88,-0.51 14.27,0.79 25.72,4.26 35.26,15.37 q 6.45,7.51 12.43,13.9 a 0.36,0.36 0 0 1 -0.21,0.6 c -34.24,5.14 -63.6,20.7 -83.41,49.12 q -0.77,1.1 -0.69,-0.24 1.54,-26.6 11.24,-47.94 z"},{"z":"glutes","d":"m 1092.12,758.09 q -11.32,3.91 -20.99,7.71 c -12.16,4.78 -21.24,13.16 -25.53,25.74 a 0.48,0.48 0 0 1 -0.84,0.14 c -13.74,-17.9 -25.37,-38.01 -28.48,-60.45 -4.82,-34.78 16.06,-62.1 45.13,-78.08 q 32.39,-17.79 71.37,-20.24 0.77,-0.05 0.81,0.72 0.34,5.98 0.51,12.21 0.73,27.38 0.54,74.62 0,0.87 -0.42,1.68 -13.36,26.01 -42.1,35.95 z"},{"z":"glutes","d":"m 1186.16,755.14 q -22.34,-9.6 -34.37,-32.01 -0.93,-1.73 -0.95,-3.5 -0.44,-43.95 0.95,-86.05 a 0.58,0.58 0 0 1 0.61,-0.56 q 41.96,2.14 76.79,23.16 c 13.08,7.9 25.57,19.74 32.87,33.53 18.71,35.37 0.74,73.49 -21.32,101.95 a 0.51,0.51 0 0 1 -0.88,-0.15 c -5.18,-15.06 -16.82,-23.21 -31.43,-28.03 q -12.38,-4.09 -22.27,-8.34 z"},{"z":"glutes","d":"m 1264.84,679.01 c -19.47,-28.27 -49.51,-44.62 -83.31,-49.28 a 0.48,0.48 0 0 1 -0.29,-0.79 q 6.39,-7.08 11.97,-13.48 c 9.56,-10.98 20.54,-14.92 34.76,-15.73 q 2.05,-0.11 3.56,1.07 c 22.85,17.9 32.44,49.93 33.85,78.03 q 0.06,1.04 -0.54,0.18 z"},{"z":"quads","d":"m 1105.13,759.58 c 5.8,-4.09 12.22,-8.33 18.77,-11.59 a 0.54,0.54 0 0 1 0.76,0.34 q 6.8,24.08 7.01,48.83 0.14,15.6 -0.3,31.35 -0.18,6.57 -1.58,13.23 -3.79,18 -7.08,34.37 -5.52,27.39 -7.25,53.63 -0.01,0.2 -0.21,0.19 h -0.01 q -0.21,0 -0.21,-0.21 0.06,-11.05 -1.13,-21.98 -3.47,-31.95 -10.99,-67.96 c -3.17,-15.15 -5.96,-29.39 -7.82,-44.53 q -1.41,-11.59 -0.64,-23.56 c 0.24,-3.74 7.85,-10.11 10.68,-12.11 z"},{"z":"quads","d":"m 1103.25,880.79 q 0.13,-2.03 0.52,-4.03 0.12,-0.59 0.23,0 6.54,34.5 9.4,71 1.16,14.9 0.83,30.46 c -0.35,16.42 -2.06,31.59 -8.52,45.43 q -0.65,1.38 -0.93,-0.12 -1.07,-5.81 -1.74,-12.63 c -4.13,-42 -2.61,-84.7 0.21,-130.11 z"},{"z":"quads","d":"m 1170.31,929.79 q -0.01,0.14 -0.14,0.14 h -0.01 q -0.15,0 -0.16,-0.15 c -1.65,-27.23 -6.7,-52.91 -12.71,-80.29 q -1.04,-4.77 -2.03,-9.9 -0.97,-5.04 -1.11,-10.04 -0.71,-25 0,-41.29 0.88,-20.1 6.78,-40.2 a 0.39,0.39 0 0 1 0.58,-0.23 c 9.66,5.72 22.47,11.93 28.7,21.66 q 0.95,1.49 1.03,4.47 c 0.23,9.46 -0.26,19.48 -1.78,29.2 q -3.09,19.91 -8.67,45.97 -4.33,20.25 -8.36,50.7 c -1.32,9.97 -1.83,19.78 -2.12,29.96 z"},{"z":"quads","d":"m 1182.66,888.38 c 3.02,46.17 3.96,90.2 -1.62,134.34 q -0.38,3.02 -1.62,0.24 -5.13,-11.5 -6.75,-24.8 -2.53,-20.86 -1.07,-43.33 2.55,-39.34 9.73,-77.33 0.48,-2.54 0.64,0.04 0.36,5.65 0.69,10.84 z"},{"z":"hamstrings","d":"m 1016.46,760.39 c 9.44,12.24 16.13,25.63 21.41,40.04 q 0.82,2.23 0.84,4.98 0.07,11.27 -2.12,20.02 -2.75,11.03 -6.86,22.65 -0.52,1.46 -0.85,-0.05 -5.74,-25.82 -9.75,-52.59 -2.71,-18.1 -3.52,-34.73 -0.08,-1.52 0.85,-0.32 z"},{"z":"hamstrings","d":"m 1070.52,797.23 c -11.68,27.55 -15.75,60.62 -14.27,91.04 q 0.39,8.01 2.12,18.82 4.13,25.86 6.66,45.29 c 2.03,15.61 1.65,31.91 -2.1,47.3 q -0.46,1.88 -0.63,-0.05 -1.63,-18.54 -5.82,-37.03 c -4.65,-20.57 -11.75,-43.58 -16.62,-63.37 -3.73,-15.15 -6.46,-30.31 -6.22,-45.8 q 0.49,-31.41 19.87,-55.13 c 2.88,-3.51 6.39,-5.98 9.88,-8.87 q 4.53,-3.74 10.3,-2.59 a 1.34,1.33 19.9 0 1 0.91,1.94 q -2.27,4.18 -4.08,8.45 z"},{"z":"hamstrings","d":"m 1098.11,859.08 c 1.35,28.16 0.76,58.11 -0.79,88.31 q -0.29,5.81 -1.41,12.09 -3.22,18.13 0.59,38.78 0.25,1.36 -0.6,0.27 c -20.01,-25.52 -30.66,-57.27 -32.98,-89.64 -3.21,-44.66 6.94,-89.32 20.75,-132.24 q 0.55,-1.71 1.12,0 4.19,12.73 6.41,24.46 5.53,29.26 6.91,57.97 z"},{"z":"hamstrings","d":"m 1219.83,958.26 c 1.6,-16.19 4.52,-34.12 7.27,-51.04 q 1.66,-10.21 2.07,-18.85 1.54,-32.19 -5.11,-62.59 -4.38,-20.02 -13.16,-37.05 -0.74,-1.43 0.83,-1.82 c 6.74,-1.68 10.82,2.92 15.54,6.72 q 2.63,2.11 4.95,4.97 22.46,27.73 19.33,65.93 c -1.28,15.6 -4.64,30.53 -8.67,45.57 q -4.34,16.19 -8.51,30.94 -8.04,28.43 -11.39,59.02 -0.17,1.55 -0.51,0.03 -4.7,-20.89 -2.64,-41.83 z"},{"z":"hamstrings","d":"m 1222.33,911.18 c -2.52,31.89 -13.09,61.94 -32.73,87.27 q -0.72,0.94 -0.52,-0.23 2.27,-12.72 1.81,-27.27 -0.2,-6.27 -1.31,-11.44 -1.06,-4.94 -1.37,-9.68 -2.26,-34.73 -1.33,-78.46 0.82,-38.23 7.92,-73.18 2.24,-11.02 6.07,-21.84 0.39,-1.11 0.77,0.01 c 14.36,43.28 24.25,89.74 20.69,134.82 z"},{"z":"hamstrings","d":"m 1252.18,789.16 c 4.38,-10.33 10.1,-20.26 17.11,-29.06 q 0.66,-0.83 0.64,0.22 -0.05,2.47 -0.26,5.11 c -2.25,28.2 -7.17,55.27 -13.07,82.76 q -0.28,1.33 -0.76,0.06 -5.28,-13.81 -7.95,-27.73 c -1.27,-6.66 -2.21,-15.94 0.54,-22.48 q 1.91,-4.56 3.75,-8.88 z"},{"z":"calves","d":"m 1058.29,1085.75 c 6.08,-36.26 10.83,-64.98 13.27,-97.84 a 0.64,0.63 12.9 0 1 0.87,-0.54 c 4.34,1.73 9.74,5.17 11.34,9.62 q 0.48,1.32 0.33,3.57 c -2.18,33.02 -2.33,66.33 -2.21,98.92 q 0.04,10.61 0.89,19.22 2.51,25.4 2.71,52.08 c 0.09,12.28 -0.31,25.64 -3.38,37.51 q -0.44,1.7 -1.2,3.04 a 1.46,1.45 41.5 0 1 -2.43,0.15 c -11.56,-15.48 -22.57,-30.58 -27.04,-49.16 -1.94,-8.07 -1.22,-16.06 -0.32,-24.08 q 3.25,-29.05 7.17,-52.49 z"},{"z":"calves","d":"m 1065.65,1205.72 q 0.18,-0.49 0.65,-0.28 0.57,0.24 0.99,0.74 c 7.66,9.08 12.41,22.27 15.49,34.01 q 4.92,18.73 7.73,38.56 5.06,35.68 6.15,72.03 0.14,4.75 0.25,9.3 0.09,3.29 -3.11,2.5 -0.29,-0.07 -0.59,-0.13 -3.27,-0.66 -3.31,-4 c -0.46,-33.25 -5.05,-66.1 -13.91,-98.69 q -4.29,-15.78 -9.2,-30.12 c -2.89,-8.45 -4,-15.96 -1.14,-23.92 z"},{"z":"calves","d":"m 1092.9,1005.49 c 6.21,14.55 10.89,30.05 15.1,45.29 q 10.42,37.71 15.89,75.17 c 2.5,17.09 4.13,34.52 2.57,51.57 -0.69,7.55 -2.44,16.36 -7.25,22.3 a 0.72,0.71 31.3 0 1 -0.84,0.2 q -15.39,-6.63 -22.38,-22.48 -0.37,-0.84 -0.47,-1.77 -7.84,-73.34 -8.63,-146.47 -0.15,-13.23 1,-26.05 0.18,-2.03 0.73,-4.04 a 0.43,0.43 0 0 1 0.78,-0.13 q 2.25,3.5 3.5,6.41 z"},{"z":"calves","d":"m 1105.01,1296.15 c 0.31,-3.79 0.81,-7.66 0.78,-11.4 -0.13,-20.92 -0.61,-43.07 2,-63.38 0.83,-6.47 2.37,-14.24 6.84,-19.26 a 0.48,0.48 0 0 1 0.83,0.26 q 2,15.5 0.91,32.56 -1.2,18.89 -3.49,38.19 -1.15,9.79 -1.38,19.57 -0.5,21.82 -2.41,44.66 -0.8,9.48 -2.65,18.21 a 0.62,0.61 -66.5 0 1 -0.96,0.38 q -3.82,-2.71 -4.14,-6.62 -0.59,-7.27 0.39,-17.04 1.85,-18.46 3.28,-36.13 z"},{"z":"calves","d":"m 1195.51,999.93 q 1.11,-2 1.54,0.25 0.83,4.43 1.06,9.07 0.79,16.08 0.37,32.68 -1.79,71.08 -8.41,133.14 c -0.54,5.01 -5.87,11.84 -9.39,15.76 -3.68,4.08 -8.74,6.74 -13.52,9.33 q -0.36,0.2 -0.63,-0.11 c -4.85,-5.52 -6.81,-14.78 -7.44,-21.9 -1.74,-19.58 0.51,-41.13 3.73,-60.68 q 6.55,-39.63 18.22,-79.21 3.88,-13.17 8.74,-26 2.41,-6.37 5.73,-12.33 z"},{"z":"calves","d":"m 1170.98,1202.22 q 2.43,2.66 3.69,6.26 c 3.13,8.93 4.01,18.89 4.48,28.32 q 1.05,21.18 0.46,40.21 -0.29,9.19 0.45,16.73 1.84,18.75 3.59,37.51 0.69,7.41 0.77,15.52 0.06,5.8 -4.1,9 a 0.89,0.89 0 0 1 -1.42,-0.54 q -2.23,-11.91 -3.17,-25.71 -1.35,-19.53 -1.75,-36.62 -0.22,-9.41 -1.32,-18.68 -2.7,-22.94 -3.76,-42.69 -0.78,-14.6 1.04,-28.98 a 0.6,0.6 0 0 1 1.04,-0.33 z"},{"z":"calves","d":"m 1209.54,1220.37 q 3.46,-8.19 9.41,-14.95 a 0.5,0.49 56.8 0 1 0.84,0.18 q 1.93,5.91 1.63,12.13 -0.21,4.19 -2.73,11.81 -8.63,26.04 -13.9,49.21 -8.52,37.45 -9.27,80.13 -0.04,2.72 -2.68,3.4 -0.94,0.24 -1.91,0.38 -2.41,0.33 -2.37,-2.1 0.65,-35.68 4.84,-70.31 c 2.84,-23.48 7.15,-48.63 16.14,-69.88 z"},{"z":"calves","d":"m 1234.23,1161.52 c -4.22,19.14 -15.78,34.23 -26.98,49.71 a 1.72,1.72 0 0 1 -3.01,-0.42 q -1.93,-5.29 -2.63,-11.11 -1.51,-12.55 -1.6,-22.65 -0.27,-28.3 2.59,-57.1 0.96,-9.64 1.02,-20.11 0.27,-52.48 -2.22,-101.41 c -0.04,-0.76 0.35,-1.89 0.76,-2.54 q 3.68,-5.85 11.13,-8.53 0.53,-0.19 0.58,0.37 2.93,37.23 10.25,79.5 c 4.59,26.56 9.04,54.75 11.1,81.03 q 0.51,6.47 -0.99,13.26 z"},{"z":"base","d":"m 1079.17,1372.43 q 2.14,-5.13 4.33,-10.15 0.64,-1.46 0.77,0.13 0.19,2.38 0.04,5.19 -0.48,8.92 -1.17,17.73 c -0.55,6.98 -0.51,14.62 0.97,21.25 q 0.81,3.6 3.17,7.55 2.42,4.04 6.98,2.53 2.09,-0.69 2.69,-2.94 c 5.05,-18.81 8.53,-32.57 10.08,-47.69 q 0.17,-1.71 0.65,-0.06 c 4.88,16.71 7.77,34.11 9.71,51.52 a 2.81,2.81 0 0 1 -0.55,2.02 c -5.24,7.01 -14.76,8.75 -23.07,8.71 -8.31,-0.03 -16.89,-1.11 -24.67,-3.97 -3.23,-1.19 -5.27,-5.26 -4.38,-8.25 4.42,-14.8 8.65,-29.67 14.45,-43.57 z"},{"z":"base","d":"m 1206.8,1373.7 q 8.72,22.21 13.81,42.33 0.94,3.7 -1.71,6.53 -1.44,1.54 -5.28,2.63 -14.71,4.18 -29.01,2.49 -9.46,-1.11 -14.96,-6.81 -1.68,-1.75 -1.46,-3.83 2.75,-26.35 9.42,-50.74 0.68,-2.5 0.89,0.09 0.63,7.86 2.59,16.87 2.96,13.59 7.32,30.23 0.79,2.98 3.86,3.47 3.52,0.56 5.1,-1.58 c 2.84,-3.86 4.42,-8.89 4.83,-13.69 0.96,-11.15 -0.35,-22.32 -1,-33 q -0.2,-3.25 0.17,-6.56 0.09,-0.79 0.42,-0.07 2.74,5.83 5.01,11.64 z"}]};
const BODY_VB = {"maleFront":"0 0 724 1448","maleBack":"724 0 724 1448","femaleFront":"0 -168 724 1765","femaleBack":"724 -163 724 1700"};


// ============ STORAGE ============
// Plain browser localStorage — synchronous, instant, fully offline. No
// network round trip, no loading screens, no race conditions to guard
// against. saveJSON stays async-shaped only so call sites read naturally
// inside useEffect; it resolves immediately either way.
const STORAGE_KEY_PREFIX = "theforge:";
function readLocal(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error("load failed", key, e);
    return fallback;
  }
}
async function saveJSON(key, value) {
  try { window.localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value)); }
  catch (e) { console.error("save failed", key, e); }
}
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function uid() { return Math.random().toString(36).slice(2, 10); }
function titleCase(s) { return (s || "").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()); }
function previousDateKey(dateKey) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function isNonNegativeNumber(value) { return value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0; }
function forgeStorageKeys() {
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) keys.push(key);
  }
  return keys;
}
function exportLocalData() {
  const data = {};
  forgeStorageKeys().forEach((key) => { data[key] = window.localStorage.getItem(key); });
  const backup = { app: "the-forge", version: 1, exportedAt: new Date().toISOString(), data };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `the-forge-backup-${todayKey()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
function restoreLocalData(text) {
  const backup = JSON.parse(text);
  if (backup?.app !== "the-forge" || backup?.version !== 1 || !backup.data || typeof backup.data !== "object") {
    throw new Error("This is not a valid The Forge backup.");
  }
  const entries = Object.entries(backup.data);
  if (entries.some(([key, value]) => !key.startsWith(STORAGE_KEY_PREFIX) || typeof value !== "string")) {
    throw new Error("The backup contains invalid data.");
  }
  forgeStorageKeys().forEach((key) => window.localStorage.removeItem(key));
  entries.forEach(([key, value]) => window.localStorage.setItem(key, value));
}

const MEAL_SECTIONS = [
  { id: "breakfast", label: "Breakfast" }, { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" }, { id: "snacks", label: "Snacks" },
];
const DEFAULT_TARGETS = { calories: 2400, protein: 180, carbs: 250, fat: 80 };
const PROFILE_COLORS = ["#E8A33D", "#5B9BD5", "#D87BA8", "#5FB87A", "#B98AE0", "#E5604F"];

// Per-profile data is namespaced by profile id.
function pKey(profileId, base) { return `p:${profileId}:${base}`; }

// ============ APP ROOT ============
export default function App() {
  // localStorage is synchronous, so there's no real "loading" period and no
  // network failure modes to guard against — this just reads once on first
  // render. Self-heal still runs once in case the builtin plan list is
  // ever out of sync with a saved plan array.
  const [profiles, setProfiles] = useState(() => {
    const pf = readLocal("profiles", []);
    return Array.isArray(pf) ? pf : [];
  });
  const [activeProfileId, setActiveProfileId] = useState(() => readLocal("activeProfileId", null));
  const [plans, setPlans] = useState(() => {
    const saved = readLocal("plans", null);
    const arr = Array.isArray(saved) ? saved : [];
    const builtinIds = new Set(BUILTIN_PLANS.map((b) => b.id));
    const userPlans = arr.filter((p) => p && !p.builtin && !builtinIds.has(p.id));
    return [...BUILTIN_PLANS, ...userPlans];
  });

  useEffect(() => { saveJSON("profiles", profiles); }, [profiles]);
  useEffect(() => { saveJSON("activeProfileId", activeProfileId); }, [activeProfileId]);
  useEffect(() => { saveJSON("plans", plans); }, [plans]);

  // Self-heal: if the builtin plans are somehow missing, restore them.
  useEffect(() => {
    const builtinIds = new Set(BUILTIN_PLANS.map((b) => b.id));
    const hasAllBuiltins = BUILTIN_PLANS.every((b) => plans.some((p) => p.id === b.id));
    if (!hasAllBuiltins) {
      const userPlans = plans.filter((p) => p && !p.builtin && !builtinIds.has(p.id));
      setPlans([...BUILTIN_PLANS, ...userPlans]);
    }
  }, [plans]);


  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;

  // No profile chosen yet -> profile gate
  if (!activeProfile) {
    return (
      <ProfileGate
        profiles={profiles} setProfiles={setProfiles}
        onPick={(id) => setActiveProfileId(id)}
      />
    );
  }

  return (
    <Main
      profile={activeProfile}
      profiles={profiles} setProfiles={setProfiles}
      plans={plans} setPlans={setPlans}
      onSwitchProfile={() => setActiveProfileId(null)}
    />
  );
}

// ============ PROFILE GATE ============
function ProfileGate({ profiles, setProfiles, onPick }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");

  function addProfile() {
    if (!name.trim()) return;
    const color = PROFILE_COLORS[profiles.length % PROFILE_COLORS.length];
    const p = { id: uid(), name: name.trim(), color, activePlanId: null, targets: DEFAULT_TARGETS, startWeight: null, goalWeight: null };
    setProfiles((prev) => [...prev, p]);
    setName(""); setAdding(false);
    onPick(p.id);
  }

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>
      <div style={styles.gateWrap}>
        <div style={styles.gateTitle}>Who's training?</div>
        <div style={styles.gateGrid}>
          {profiles.map((p) => (
            <button key={p.id} style={styles.profileTile} onClick={() => onPick(p.id)}>
              <div style={{ ...styles.profileAvatar, background: p.color }}>{p.name[0].toUpperCase()}</div>
              <div style={styles.profileName}>{p.name}</div>
            </button>
          ))}
          {adding ? (
            <div style={{ ...styles.profileTile, gridColumn: "1 / -1", alignItems: "stretch" }}>
              <input autoFocus placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProfile()} style={styles.gateInput} />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button style={{ ...styles.primaryButton, flex: 1 }} onClick={addProfile}>Add profile</button>
                <button style={styles.secondaryButton} onClick={() => { setAdding(false); setName(""); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button style={{ ...styles.profileTile, ...styles.profileTileAdd }} onClick={() => setAdding(true)}>
              <Plus size={28} color={COLORS.textDim} />
              <div style={{ ...styles.profileName, color: COLORS.textDim }}>Add</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ MAIN (per active profile) ============
function Main({ profile, profiles, setProfiles, plans, setPlans, onSwitchProfile }) {
  const [tab, setTab] = useState("home");
  const pid = profile.id;
  const today = todayKey();

  // localStorage is synchronous — read once per profile on mount/switch,
  // no async load, no timeouts, no race conditions.
  const [targets, setTargets] = useState(profile.targets || DEFAULT_TARGETS);
  const [myFoods, setMyFoods] = useState(() => readLocal(pKey(pid, "myFoods"), []));
  const [dayLog, setDayLog] = useState(() => readLocal(pKey(pid, "dayLog"), {}));
  const [weights, setWeights] = useState(() => readLocal(pKey(pid, "weights"), []));
  const [workoutLogs, setWorkoutLogs] = useState(() => readLocal(pKey(pid, "workoutLogs"), {}));
  const [servingPrefs, setServingPrefs] = useState(() => readLocal(pKey(pid, "servingPrefs"), {}));
  const [measurements, setMeasurements] = useState(() => readLocal(pKey(pid, "measurements"), []));

  // If the active profile changes, re-read that profile's own data fresh.
  useEffect(() => {
    setTargets(profile.targets || DEFAULT_TARGETS);
    setMyFoods(readLocal(pKey(pid, "myFoods"), []));
    setDayLog(readLocal(pKey(pid, "dayLog"), {}));
    setWeights(readLocal(pKey(pid, "weights"), []));
    setWorkoutLogs(readLocal(pKey(pid, "workoutLogs"), {}));
    setServingPrefs(readLocal(pKey(pid, "servingPrefs"), {}));
    setMeasurements(readLocal(pKey(pid, "measurements"), []));
  }, [pid]);

  useEffect(() => { saveJSON(pKey(pid, "myFoods"), myFoods); }, [myFoods, pid]);
  useEffect(() => { saveJSON(pKey(pid, "dayLog"), dayLog); }, [dayLog, pid]);
  useEffect(() => { saveJSON(pKey(pid, "weights"), weights); }, [weights, pid]);
  useEffect(() => { saveJSON(pKey(pid, "workoutLogs"), workoutLogs); }, [workoutLogs, pid]);
  useEffect(() => { saveJSON(pKey(pid, "servingPrefs"), servingPrefs); }, [servingPrefs, pid]);
  useEffect(() => { saveJSON(pKey(pid, "measurements"), measurements); }, [measurements, pid]);

  // persist target edits back onto the profile record
  function updateTargets(t) {
    setTargets(t);
    setProfiles((prev) => prev.map((p) => p.id === pid ? { ...p, targets: t } : p));
  }
  function setActivePlan(planId) {
    setProfiles((prev) => prev.map((p) => p.id === pid ? { ...p, activePlanId: planId } : p));
  }

  const todaysEntries = dayLog[today] || {};
  const totals = MEAL_SECTIONS.reduce((acc, sec) => {
    (todaysEntries[sec.id] || []).forEach((it) => {
      acc.calories += it.calories || 0; acc.protein += it.protein || 0; acc.carbs += it.carbs || 0; acc.fat += it.fat || 0;
    });
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  function addEntry(sectionId, entry) {
    setDayLog((prev) => { const day = { ...(prev[today] || {}) }; day[sectionId] = [...(day[sectionId] || []), { ...entry, id: uid() }]; return { ...prev, [today]: day }; });
    if (entry.foodKey && entry.servings > 0) {
      setServingPrefs((prev) => ({ ...prev, [entry.foodKey]: entry.servings }));
    }
  }
  function removeEntry(sectionId, entryId) {
    setDayLog((prev) => { const day = { ...(prev[today] || {}) }; day[sectionId] = (day[sectionId] || []).filter((e) => e.id !== entryId); return { ...prev, [today]: day }; });
  }
  function copyPreviousDay() {
    const source = dayLog[previousDateKey(today)];
    if (!source) return;
    const copied = {};
    MEAL_SECTIONS.forEach((section) => {
      copied[section.id] = (source[section.id] || []).map((entry) => ({ ...entry, id: uid() }));
    });
    setDayLog((prev) => ({ ...prev, [today]: copied }));
  }
  function saveCustomFood(food) { setMyFoods((prev) => [...prev, { ...food, id: uid() }]); }
  function logExerciseSession(key, sets) {
    setWorkoutLogs((prev) => {
      const cur = prev[key] || { sessions: [] };
      const filtered = cur.sessions.filter((s) => s.date !== today);
      const sessions = [...filtered, { date: today, completedAt: new Date().toISOString(), sets }].sort((a, b) => a.date.localeCompare(b.date));
      return { ...prev, [key]: { sessions } };
    });
  }

  function addWeightEntry(lbs) {
    const date = todayKey();
    setWeights((prev) => [...prev.filter((w) => w.date !== date), { date, lbs }]);
    if (profile.startWeight == null) setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, startWeight: lbs } : p));
  }
  function saveGoalWeight(goalWeight) {
    setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, goalWeight } : p));
  }
  function addMeasurementEntry(entry) {
    const kind = entry.kind || "circumference";
    setMeasurements((prev) => [
      ...prev.filter((m) => !(
        m.date === entry.date &&
        m.part === entry.part &&
        (m.kind || "circumference") === kind
      )),
      { ...entry, kind }
    ].sort((a, b) => a.date.localeCompare(b.date)));
  }

  return (
    <div style={styles.app}>
      <style>{globalCss}</style>
      <TopBar profile={profile} onSwitchProfile={onSwitchProfile} />
      <div style={styles.content}>
        {tab === "home" && (
          <Dashboard profile={profile} weights={weights} workoutLogs={workoutLogs} dayLog={dayLog}
            plans={plans} targets={targets} totals={totals} onGoTrain={() => setTab("train")} />
        )}
        {tab === "train" && (
          <TrainHome
            profile={profile} plans={plans} setPlans={setPlans}
            setActivePlan={setActivePlan} workoutLogs={workoutLogs} logExerciseSession={logExerciseSession}
          />
        )}
        {tab === "body" && <BodyTab workoutLogs={workoutLogs} plans={plans} profile={profile} setProfiles={setProfiles}
          weights={weights} addWeightEntry={addWeightEntry} saveGoalWeight={saveGoalWeight}
          measurements={measurements} addMeasurementEntry={addMeasurementEntry} />}
        {tab === "food" && (
          <FoodTab totals={totals} targets={targets} setTargets={updateTargets} todaysEntries={todaysEntries}
            dayLog={dayLog} copyPreviousDay={copyPreviousDay}
            addEntry={addEntry} removeEntry={removeEntry} myFoods={myFoods} saveCustomFood={saveCustomFood}
            servingPrefs={servingPrefs}
            deleteFood={(id) => setMyFoods((prev) => prev.filter((f) => f.id !== id))} />
        )}
      </div>
      <nav style={styles.tabBar}>
        <TabButton icon={LayoutDashboard} label="Home" active={tab === "home"} onClick={() => setTab("home")} />
        <TabButton icon={Dumbbell} label="Train" active={tab === "train"} onClick={() => setTab("train")} />
        <TabButton icon={PersonStanding} label="Body" active={tab === "body"} onClick={() => setTab("body")} />
        <TabButton icon={UtensilsCrossed} label="Food" active={tab === "food"} onClick={() => setTab("food")} />
      </nav>
    </div>
  );
}

function TopBar({ profile, onSwitchProfile }) {
  const [showData, setShowData] = useState(false);
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);
  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      restoreLocalData(await file.text());
      window.location.reload();
    } catch (error) {
      setMessage(error.message || "Could not restore that backup.");
      event.target.value = "";
    }
  }
  return (
    <>
      <div style={styles.topBar}>
        <button style={styles.profileChip} onClick={onSwitchProfile}>
          <div style={{ ...styles.chipAvatar, background: profile.color }}>{profile.name[0].toUpperCase()}</div>
          <span style={styles.chipName}>{profile.name}</span>
          <ChevronDown size={14} color={COLORS.textDim} />
        </button>
        <button aria-label="Data settings" title="Data settings" style={{ ...styles.iconButton, marginLeft: "auto" }} onClick={() => { setMessage(""); setShowData(true); }}>
          <Settings size={20} color={COLORS.textDim} />
        </button>
      </div>
      {showData && (
        <div style={styles.modalOverlay} onClick={() => setShowData(false)}>
          <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}><span style={styles.modalTitle}>Your data</span><button aria-label="Close" style={styles.iconButton} onClick={() => setShowData(false)}><X size={18} color={COLORS.textDim} /></button></div>
            <div style={styles.helpNote}>Your records stay in this browser. Export a backup periodically and before clearing browser data or changing devices.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
              <button style={styles.primaryButton} onClick={exportLocalData}><Download size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />Export</button>
              <button style={styles.secondaryButton} onClick={() => fileRef.current?.click()}><Upload size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />Restore</button>
            </div>
            <input ref={fileRef} type="file" accept="application/json,.json" onChange={importBackup} hidden />
            {message && <div role="alert" style={{ ...styles.warningBanner, marginTop: 12, marginBottom: 0 }}>{message}</div>}
          </div>
        </div>
      )}
    </>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.tabButton, color: active ? COLORS.amber : COLORS.textDim }}>
      <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
      <span style={{ fontSize: 11, marginTop: 2, fontWeight: active ? 600 : 400 }}>{label}</span>
    </button>
  );
}

// ============ TRAIN: home routes between library, active plan, builder ============
function TrainHome({ profile, plans, setPlans, setActivePlan, workoutLogs, logExerciseSession }) {
  const [screen, setScreen] = useState("auto"); // auto | library | builder | run
  const [editingPlanId, setEditingPlanId] = useState(null);

  const activePlan = plans.find((p) => p.id === profile.activePlanId) || null;

  // Decide initial screen: if no active plan, show library; else show the run view
  const effective = screen === "auto" ? (activePlan ? "run" : "library") : screen;

  if (effective === "library") {
    return (
      <PlanLibrary
        plans={plans} activePlanId={profile.activePlanId}
        onSelect={(id) => { setActivePlan(id); setScreen("run"); }}
        onNew={() => { setEditingPlanId(null); setScreen("builder"); }}
        onEdit={(id) => { setEditingPlanId(id); setScreen("builder"); }}
        onDelete={(id) => setPlans((prev) => prev.filter((p) => p.id !== id))}
      />
    );
  }
  if (effective === "builder") {
    return (
      <PlanBuilder
        existing={plans.find((p) => p.id === editingPlanId) || null}
        createdBy={profile.id}
        onCancel={() => setScreen("library")}
        onSave={(plan) => {
          setPlans((prev) => {
            const exists = prev.some((p) => p.id === plan.id);
            return exists ? prev.map((p) => p.id === plan.id ? plan : p) : [...prev, plan];
          });
          setScreen("library");
        }}
      />
    );
  }
  // run
  return (
    <ActivePlanRunner
      plan={activePlan}
      workoutLogs={workoutLogs} logExerciseSession={logExerciseSession}
      onChangePlan={() => setScreen("library")}
    />
  );
}

// ============ PLAN LIBRARY ============
function PlanLibrary({ plans, activePlanId, onSelect, onNew, onEdit, onDelete }) {
  return (
    <div style={styles.tabContent}>
      <div style={styles.screenHeader}>
        <div style={styles.screenTitle}>Plan Library</div>
        <button style={styles.primaryButtonSm} onClick={onNew}><Plus size={15} style={{ verticalAlign: "-2px" }} /> New plan</button>
      </div>
      {plans.map((plan) => {
        const dayCount = plan.structure === "weeks"
          ? (plan.weeks?.[0]?.days?.length || 0)
          : (plan.days?.length || 0);
        const meta = plan.structure === "weeks" ? `${plan.weeks.length} weeks · ${dayCount} days/week` : `${dayCount} days`;
        const isActive = plan.id === activePlanId;
        return (
          <div key={plan.id} style={{ ...styles.planCard, borderColor: isActive ? COLORS.amber : COLORS.cardBorder }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.planName}>{plan.name}</div>
              <div style={styles.planMeta}>
                {meta}{plan.builtin ? " · preloaded" : ""}{isActive ? " · active" : ""}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {!plan.builtin && (
                <>
                  <button style={styles.iconButton} onClick={() => onEdit(plan.id)}><Pencil size={16} color={COLORS.textDim} /></button>
                  <button style={styles.iconButton} onClick={() => { if (confirm(`Delete "${plan.name}"?`)) onDelete(plan.id); }}><Trash2 size={16} color={COLORS.textDim} /></button>
                </>
              )}
              <button style={isActive ? styles.activeBadgeBtn : styles.primaryButtonSm} onClick={() => onSelect(plan.id)}>
                {isActive ? "Resume" : "Select"}
              </button>
            </div>
          </div>
        );
      })}
      <div style={styles.helpNote}>Plans are shared between profiles. Selecting one makes it your active plan and keeps it until you switch.</div>
    </div>
  );
}

// ============ PLAN BUILDER / EDITOR ============
function PlanBuilder({ existing, createdBy, onCancel, onSave }) {
  const [name, setName] = useState(existing?.name || "");
  const wasWeekStructured = existing?.structure === "weeks";
  // builder works in flat "days" structure
  const [days, setDays] = useState(() => {
    if (existing?.structure === "days") return existing.days.map((d) => ({ ...d, ex: d.ex.map((e) => ({ ...e })) }));
    if (existing?.structure === "weeks") {
      // Editing a week-based plan: only week 1 is used as a starting
      // template, and saving converts it to a single repeating day-based
      // plan. Weeks 2+ are NOT carried over — see the warning banner below.
      return existing.weeks[0].days.map((d) => ({ ...d, ex: d.ex.map((e) => ({ ...e })) }));
    }
    return [{ d: 1, focus: "", ex: [] }];
  });
  const [openDay, setOpenDay] = useState(0);

  function addDay() { setDays((prev) => [...prev, { d: prev.length + 1, focus: "", ex: [] }]); setOpenDay(days.length); }
  function removeDay(i) { setDays((prev) => prev.filter((_, idx) => idx !== i).map((d, idx) => ({ ...d, d: idx + 1 }))); }
  function setFocus(i, focus) { setDays((prev) => prev.map((d, idx) => idx === i ? { ...d, focus } : d)); }
  function addExercise(i) { setDays((prev) => prev.map((d, idx) => idx === i ? { ...d, ex: [...d.ex, { n: "", ws: "3", r: "8", rpe: "", rest: "", note: "", mz: {} }] } : d)); }
  function updateExercise(di, ei, field, val) {
    setDays((prev) => prev.map((d, idx) => idx === di ? { ...d, ex: d.ex.map((e, j) => j === ei ? { ...e, [field]: val } : e) } : d));
  }
  function removeExercise(di, ei) { setDays((prev) => prev.map((d, idx) => idx === di ? { ...d, ex: d.ex.filter((_, j) => j !== ei) } : d)); }
  function toggleZone(di, ei, zone) {
    setDays((prev) => prev.map((d, idx) => {
      if (idx !== di) return d;
      return { ...d, ex: d.ex.map((e, j) => {
        if (j !== ei) return e;
        const mz = { ...(e.mz || {}) };
        if (mz[zone]) delete mz[zone]; else mz[zone] = 1.0;
        return { ...e, mz };
      }) };
    }));
  }

  function save() {
    if (!name.trim()) { alert("Give the plan a name."); return; }
    const cleanDays = days.map((d, i) => ({ d: i + 1, focus: d.focus.trim() || `Day ${i + 1}`, ex: d.ex.filter((e) => e.n.trim()).map((e) => ({ ...e, n: e.n.trim() })) }));
    if (cleanDays.every((d) => d.ex.length === 0)) { alert("Add at least one exercise."); return; }
    const plan = {
      id: existing?.id || uid(),
      name: name.trim(),
      createdBy: existing?.createdBy || createdBy,
      builtin: false,
      structure: "days",
      days: cleanDays,
    };
    onSave(plan);
  }

  return (
    <div style={styles.tabContent}>
      <button style={styles.backRow} onClick={onCancel}><ArrowLeft size={18} /> Library</button>
      <div style={styles.screenTitle}>{existing ? "Edit Plan" : "New Plan"}</div>
      {wasWeekStructured && (
        <div style={styles.warningBanner}>
          This plan has multiple weeks. Editing here only keeps week 1 as a starting point — saving will turn it into a single repeating day-based plan, and weeks 2 and beyond will be discarded. Cancel now if you wanted to keep the full multi-week version.
        </div>
      )}
      <input style={styles.input} placeholder="Plan name (e.g. Anna's Upper/Lower)" value={name} onChange={(e) => setName(e.target.value)} />

      {days.map((day, di) => (
        <div key={di} style={styles.card}>
          <div style={styles.sectionHeader} onClick={() => setOpenDay(openDay === di ? -1 : di)}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              {openDay === di ? <ChevronUp size={16} color={COLORS.textDim} /> : <ChevronDown size={16} color={COLORS.textDim} />}
              <span style={styles.sectionTitle}>Day {di + 1}</span>
              <span style={styles.dimLabel}>{day.ex.length} ex</span>
            </div>
            <button style={styles.iconButton} onClick={(e) => { e.stopPropagation(); removeDay(di); }}><Trash2 size={15} color={COLORS.textDim} /></button>
          </div>
          {openDay === di && (
            <div style={{ marginTop: 10 }}>
              <input style={{ ...styles.input, marginBottom: 10 }} placeholder="Focus (e.g. Push, Legs)" value={day.focus} onChange={(e) => setFocus(di, e.target.value)} />
              {day.ex.map((ex, ei) => (
                <div key={ei} style={styles.exBuilderRow}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input style={{ ...styles.input, flex: 1 }} placeholder="Exercise name" value={ex.n} onChange={(e) => updateExercise(di, ei, "n", e.target.value)} />
                    <button style={styles.iconButton} onClick={() => removeExercise(di, ei)}><X size={16} color={COLORS.textDim} /></button>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    {[["ws", "Sets"], ["r", "Reps"], ["rpe", "RPE"], ["rest", "Rest"]].map(([field, label]) => (
                      <div key={field} style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.miniLabel}>{label}</div>
                        <input style={styles.miniInput} placeholder={field === "rest" ? "2-3m" : ""} value={ex[field]} onChange={(e) => updateExercise(di, ei, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div style={styles.miniLabel}>Muscles worked (drives the body heatmap)</div>
                  <div style={styles.zonePicker}>
                    {ZONES.map((z) => (
                      <button key={z} onClick={() => toggleZone(di, ei, z)}
                        style={{ ...styles.zoneChip, ...(ex.mz && ex.mz[z] ? styles.zoneChipOn : {}) }}>{z}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button style={{ ...styles.secondaryButton, marginTop: 8 }} onClick={() => addExercise(di)}><Plus size={14} style={{ verticalAlign: "-2px" }} /> Exercise</button>
            </div>
          )}
        </div>
      ))}

      <button style={styles.secondaryButton} onClick={addDay}><Plus size={15} style={{ verticalAlign: "-2px" }} /> Add day</button>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button style={{ ...styles.primaryButton, flex: 1 }} onClick={save}>Save plan</button>
        <button style={styles.secondaryButton} onClick={onCancel}>Cancel</button>
      </div>
      <div style={styles.helpNote}>Muscle tags drive the body heatmap. Tag what each exercise hits.</div>
    </div>
  );
}

// ============ ACTIVE PLAN RUNNER ============
function logKeyFor(plan, dayId, exName, wk) {
  return plan.structure === "weeks" ? `${plan.id}|w${wk}|d${dayId}|${exName}` : `${plan.id}|d${dayId}|${exName}`;
}

function ActivePlanRunner({ plan, workoutLogs, logExerciseSession, onChangePlan }) {
  const [view, setView] = useState("days");
  const [selWeek, setSelWeek] = useState(0);
  const [selDay, setSelDay] = useState(0);
  const [selEx, setSelEx] = useState(0);
  const [runMode, setRunMode] = useState(() => readLocal("workoutMode", "table"));

  useEffect(() => { saveJSON("workoutMode", runMode); }, [runMode]);

  if (!plan) return null;

  const isWeekly = plan.structure === "weeks";
  const week = isWeekly ? plan.weeks[selWeek] : null;
  const daysList = isWeekly ? week.days : plan.days;
  const day = daysList[selDay];
  const ex = day?.ex[selEx];
  const wkNum = isWeekly ? week.wk : null;

  function dayLoggedCount(d) {
    return d.ex.filter((e) => {
      const log = workoutLogs[logKeyFor(plan, d.d, e.n, wkNum)];
      return (log?.sessions || []).length > 0;
    }).length;
  }

  if (view === "days") {
    return (
      <div style={styles.tabContent}>
        <div style={styles.screenHeader}>
          <div style={{ minWidth: 0 }}>
            <div style={styles.screenTitle}>{plan.name}</div>
            <button style={styles.linkButton} onClick={onChangePlan}><Library size={13} style={{ verticalAlign: "-2px" }} /> Change plan</button>
          </div>
        </div>

        {isWeekly && (
          <div style={styles.weekPicker}>
            <button style={styles.iconButton} disabled={selWeek === 0} onClick={() => setSelWeek((w) => Math.max(0, w - 1))}>
              <ChevronLeft size={20} color={selWeek === 0 ? COLORS.cardBorder : COLORS.text} />
            </button>
            <div style={styles.weekLabel}>Week {week.wk} <span style={styles.dimLabel}>· Block {week.blk}</span></div>
            <button style={styles.iconButton} disabled={selWeek === plan.weeks.length - 1} onClick={() => setSelWeek((w) => Math.min(plan.weeks.length - 1, w + 1))}>
              <ChevronRight size={20} color={selWeek === plan.weeks.length - 1 ? COLORS.cardBorder : COLORS.text} />
            </button>
          </div>
        )}

        {daysList.map((d, di) => {
          const done = dayLoggedCount(d);
          return (
            <button key={di} style={styles.dayCard} onClick={() => { setSelDay(di); setView("exlist"); }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.dayCardTitle}>Day {d.d}</div>
                <div style={styles.dayCardFocus}>{titleCase(d.focus)}</div>
              </div>
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={styles.dimLabel}>{d.ex.length} exercises</span>
                {done > 0 && <span style={{ ...styles.badge, background: done === d.ex.length ? COLORS.green : COLORS.cardBorder, color: done === d.ex.length ? COLORS.bg : COLORS.textDim }}>{done === d.ex.length ? "Done" : `${done}/${d.ex.length}`}</span>}
              </div>
              <ChevronRight size={18} color={COLORS.textDim} style={{ marginLeft: 8 }} />
            </button>
          );
        })}
      </div>
    );
  }

  if (view === "exlist") {
    return (
      <div style={styles.tabContent}>
        <button style={styles.backRow} onClick={() => setView("days")}><ChevronLeft size={18} /> {isWeekly ? `Week ${week.wk}` : plan.name}</button>
        <div style={styles.screenHeader}><div><div style={styles.screenTitle}>Day {day.d}</div><div style={styles.dimLabel}>{titleCase(day.focus)}{isWeekly ? ` · Week ${week.wk}` : ""}</div></div></div>
        <div style={styles.modeSwitch}>
          {[["table", "Table"], ["guided", "Guided"]].map(([m, label]) => (
            <button key={m} style={{ ...styles.modeButton, ...(runMode === m ? styles.modeButtonActive : {}) }} onClick={() => setRunMode(m)}>{label}</button>
          ))}
        </div>
        {runMode === "guided" && (
          <GuidedWorkout
            plan={plan} day={day} wkNum={wkNum} exercises={day.ex} workoutLogs={workoutLogs}
            activeIndex={selEx} setActiveIndex={setSelEx}
            onSaveExercise={(exercise, sets) => logExerciseSession(logKeyFor(plan, day.d, exercise.n, wkNum), sets)}
          />
        )}
        {runMode === "table" && day.ex.map((e, ei) => {
          const log = workoutLogs[logKeyFor(plan, day.d, e.n, wkNum)];
          const last = log?.sessions?.[log.sessions.length - 1];
          const loggedToday = (log?.sessions || []).length > 0;
          return (
            <button key={ei} style={styles.exCard} onClick={() => { setSelEx(ei); setView("logger"); }}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.exCardName}>{titleCase(e.n)}{loggedToday && <Check size={14} color={COLORS.green} style={{ marginLeft: 6, verticalAlign: "-2px" }} />}</div>
                <div style={styles.exCardMeta}>{e.ws} × {e.r}{e.rpe ? ` @ ${e.rpe}` : ""}{e.rest ? ` · ${e.rest.toLowerCase()}` : ""}</div>
                {last && <div style={styles.exLastLine}>last: {last.sets.map((s) => `${s.weight || "—"}×${s.reps || "—"}`).join("  ")}</div>}
              </div>
              <ChevronRight size={18} color={COLORS.textDim} />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <ExerciseLogger
      plan={plan} day={day} ex={ex} wkNum={wkNum} isWeekly={isWeekly} week={week}
      log={workoutLogs[logKeyFor(plan, day.d, ex.n, wkNum)]}
      onBack={() => setView("exlist")}
      onSave={(sets) => { logExerciseSession(logKeyFor(plan, day.d, ex.n, wkNum), sets); setView("exlist"); }}
    />
  );
}

function parseRestSeconds(rest) {
  const text = String(rest || "").toLowerCase();
  const nums = [...text.matchAll(/\d+(\.\d+)?/g)].map((m) => Number(m[0])).filter((n) => n > 0);
  if (!nums.length) return 90;
  const val = nums[Math.floor(nums.length / 2)];
  return text.includes("min") || val <= 10 ? Math.round(val * 60) : Math.round(val);
}

function formatTimer(seconds) {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function GuidedWorkout({ plan, day, wkNum, exercises, workoutLogs, activeIndex, setActiveIndex, onSaveExercise }) {
  const ex = exercises[activeIndex] || exercises[0];
  const today = todayKey();
  const log = ex ? workoutLogs[logKeyFor(plan, day.d, ex.n, wkNum)] : null;
  const sessions = log?.sessions || [];
  const lastSession = sessions.filter((s) => s.date !== today).slice(-1)[0];
  const todaySession = sessions.find((s) => s.date === today);
  const targetSets = parseInt(ex?.ws) || 3;
  const [setIndex, setSetIndex] = useState(0);
  const [sets, setSets] = useState(() => todaySession?.sets || Array.from({ length: targetSets }, (_, i) => ({ weight: lastSession?.sets[i]?.weight || "", reps: lastSession?.sets[i]?.reps || ex?.r || "", note: "" })));
  const [restLeft, setRestLeft] = useState(0);

  useEffect(() => {
    const nextLog = ex ? workoutLogs[logKeyFor(plan, day.d, ex.n, wkNum)] : null;
    const nextSessions = nextLog?.sessions || [];
    const nextToday = nextSessions.find((s) => s.date === today);
    const nextLast = nextSessions.filter((s) => s.date !== today).slice(-1)[0];
    const nextTarget = parseInt(ex?.ws) || 3;
    setSetIndex(0);
    setRestLeft(0);
    setSets(nextToday?.sets || Array.from({ length: nextTarget }, (_, i) => ({ weight: nextLast?.sets[i]?.weight || "", reps: nextLast?.sets[i]?.reps || ex?.r || "", note: "" })));
  }, [activeIndex, day.d, ex?.n, ex?.r, ex?.ws, plan, wkNum, today]);

  useEffect(() => {
    if (restLeft <= 0) return;
    const id = window.setInterval(() => setRestLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [restLeft]);

  if (!ex) return <div style={styles.emptyHint}>No exercises in this day.</div>;

  const current = sets[setIndex] || { weight: "", reps: "", note: "" };
  const completed = (log?.sessions || []).length > 0;
  const progress = `${activeIndex + 1}/${exercises.length}`;
  const updateCurrent = (field, val) => setSets((prev) => prev.map((s, i) => i === setIndex ? { ...s, [field]: val } : s));
  const saveNow = (nextSets = sets) => onSaveExercise(ex, nextSets);
  const completeSet = () => {
    const nextSets = sets.map((s, i) => {
      if (i === setIndex) return { ...s, done: true };
      if (i === setIndex + 1) return { ...s, weight: s.weight || current.weight, reps: s.reps || ex.r || current.reps };
      return s;
    });
    setSets(nextSets);
    saveNow(nextSets);
    if (setIndex < nextSets.length - 1) {
      setRestLeft(parseRestSeconds(ex.rest));
      setSetIndex((i) => i + 1);
    } else if (activeIndex < exercises.length - 1) {
      setRestLeft(0);
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div style={styles.guidedCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={styles.dimLabel}>Exercise {progress}</div>
        {completed && <span style={{ ...styles.badge, background: COLORS.green, color: COLORS.bg }}>Logged</span>}
      </div>
      <div style={styles.exTitle}>{titleCase(ex.n)}</div>
      <div style={styles.exPrescription}>{ex.ws} sets x {ex.r} reps{ex.rpe ? ` @ ${ex.rpe}` : ""}</div>
      {lastSession && <div style={styles.exLastLine}>last: {lastSession.sets.map((s) => `${s.weight || "-"}x${s.reps || "-"}`).join("  ")}</div>}
      {ex.note && <div style={styles.exNote}>{ex.note}</div>}

      {restLeft > 0 && (
        <div style={styles.restPanel}>
          <div style={styles.cardHeader}>Rest</div>
          <div style={styles.timerText}>{formatTimer(restLeft)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button style={styles.secondaryButton} onClick={() => setRestLeft(0)}>Skip Rest</button>
            <button style={styles.secondaryButton} onClick={() => setRestLeft(parseRestSeconds(ex.rest))}>Restart</button>
            <button style={styles.secondaryButton} onClick={() => setRestLeft((s) => s + 30)}>Extend</button>
            <button style={styles.primaryButton} onClick={() => setRestLeft(0)}>Continue</button>
          </div>
        </div>
      )}

      <div style={styles.guidedSetBox}>
        <div style={styles.cardHeader}>Set {setIndex + 1} of {sets.length}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={styles.fieldLabel}>Weight</label>
            <input style={styles.setInput} type="number" inputMode="decimal" value={current.weight} placeholder={lastSession?.sets[setIndex]?.weight || "lbs"} onChange={(e) => updateCurrent("weight", e.target.value)} />
          </div>
          <div>
            <label style={styles.fieldLabel}>Reps</label>
            <input style={styles.setInput} type="number" inputMode="numeric" value={current.reps} placeholder={ex.r} onChange={(e) => updateCurrent("reps", e.target.value)} />
          </div>
        </div>
        <button style={{ ...styles.primaryButton, width: "100%", marginTop: 12 }} onClick={completeSet}>Complete Set</button>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button style={styles.secondaryButton} disabled={activeIndex === 0} onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>Previous</button>
        <button style={{ ...styles.secondaryButton, flex: 1 }} onClick={() => saveNow()}>Save Progress</button>
        <button style={styles.secondaryButton} disabled={activeIndex >= exercises.length - 1} onClick={() => setActiveIndex(Math.min(exercises.length - 1, activeIndex + 1))}>Next</button>
      </div>
    </div>
  );
}

function ExerciseLogger({ plan, day, ex, wkNum, isWeekly, week, log, onBack, onSave }) {
  const today = todayKey();
  const sessions = log?.sessions || [];
  const lastSession = sessions.filter((s) => s.date !== today).slice(-1)[0];
  const todaySession = sessions.find((s) => s.date === today);

  let pr = null;
  sessions.forEach((s) => s.sets.forEach((st) => {
    const w = parseFloat(st.weight);
    if (!isNaN(w) && (pr === null || w > pr.weight)) pr = { weight: w, reps: st.reps, date: s.date };
  }));

  const targetSets = parseInt(ex.ws) || 3;
  const initSets = todaySession ? todaySession.sets
    : Array.from({ length: targetSets }, (_, i) => ({ weight: lastSession?.sets[i]?.weight || "", reps: lastSession?.sets[i]?.reps || ex.r || "", note: "" }));

  const [sets, setSets] = useState(initSets);
  const [showNotes, setShowNotes] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const prescribedRest = Math.max(30, (parseInt(ex.rest) || 2) * 60);
  const [restSeconds, setRestSeconds] = useState(prescribedRest);
  const [timerRunning, setTimerRunning] = useState(false);
  const [error, setError] = useState("");
  const weightRefs = useRef([]);
  const repRefs = useRef([]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const id = window.setInterval(() => setRestSeconds((seconds) => {
      if (seconds <= 1) { setTimerRunning(false); return 0; }
      return seconds - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  function updateSet(i, field, val) { setSets((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s)); }
  function addSet() { setSets((prev) => [...prev, { weight: prev[prev.length - 1]?.weight || "", reps: "", note: "" }]); }
  function removeSet(i) { setSets((prev) => prev.filter((_, idx) => idx !== i)); }
  function saveSession() {
    const completed = sets.filter((set) => set.reps !== "" || set.weight !== "");
    const valid = completed.length > 0 && completed.every((set) => Number(set.reps) > 0 && (set.weight === "" || isNonNegativeNumber(set.weight)));
    if (!valid) { setError("Log at least one set with positive reps and a non-negative weight."); return; }
    setError("");
    onSave(completed);
  }

  return (
    <div style={styles.tabContent}>
      <button style={styles.backRow} onClick={onBack}><ChevronLeft size={18} /> Day {day.d}</button>
      <div style={styles.card}>
        <div style={styles.exTitle}>{titleCase(ex.n)}</div>
        <div style={styles.exPrescription}>{ex.ws} working sets × {ex.r} reps{ex.rpe ? ` @ ${ex.rpe}` : ""}{ex.rest ? <span style={styles.dimLabel}> · rest {ex.rest.toLowerCase()}</span> : null}</div>
        {ex.note && <div style={styles.exNote}>{ex.note}</div>}
        <div style={styles.refRow}>
          {lastSession && <div style={styles.refChip}><History size={13} /> Last: {lastSession.sets.map((s) => `${s.weight || "—"}×${s.reps || "—"}`).join(" ")}</div>}
          {pr && <div style={{ ...styles.refChip, color: COLORS.amber, borderColor: COLORS.amber }}><Trophy size={13} /> PR: {pr.weight}×{pr.reps}</div>}
        </div>
      </div>
      <div style={{ ...styles.card, display: "flex", alignItems: "center", gap: 12 }}>
        <Timer size={20} color={timerRunning ? COLORS.amber : COLORS.textDim} />
        <div style={{ flex: 1 }}><div style={styles.dimLabel}>Rest timer</div><div style={{ ...styles.tabularNum, fontSize: 22 }}>{String(Math.floor(restSeconds / 60)).padStart(2, "0")}:{String(restSeconds % 60).padStart(2, "0")}</div></div>
        <button style={styles.secondaryButton} onClick={() => setRestSeconds((s) => s + 30)}>+30</button>
        <button style={styles.primaryButtonSm} onClick={() => restSeconds === 0 ? setRestSeconds(prescribedRest) : setTimerRunning((v) => !v)}>{timerRunning ? "Pause" : "Start"}</button>
        <button aria-label="Reset rest timer" title="Reset timer" style={styles.iconButton} onClick={() => { setTimerRunning(false); setRestSeconds(prescribedRest); }}><History size={16} color={COLORS.textDim} /></button>
      </div>
      <div style={styles.card}>
        <div style={styles.setHeaderRow}>
          <span style={{ ...styles.setCol, flex: "0 0 28px", color: COLORS.textDim }}>Set</span>
          <span style={{ ...styles.setCol, color: COLORS.textDim }}>Weight</span>
          <span style={{ ...styles.setCol, color: COLORS.textDim }}>Reps</span>
          <span style={{ flex: "0 0 32px" }} />
        </div>
        {sets.map((s, i) => (
          <div key={i}>
            <div style={styles.setRow}>
              <span style={{ ...styles.setCol, flex: "0 0 28px", fontFamily: FONT_NUM, color: COLORS.textDim }}>{i + 1}</span>
              <input ref={(el) => weightRefs.current[i] = el} style={styles.setInput} type="number" min="0" inputMode="decimal" placeholder={lastSession?.sets[i]?.weight || "lbs"} value={s.weight} onChange={(e) => updateSet(i, "weight", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") repRefs.current[i]?.focus(); }} onBlur={() => { if (s.weight && !s.reps) repRefs.current[i]?.focus(); }} />
              <input ref={(el) => repRefs.current[i] = el} style={styles.setInput} type="number" min="1" inputMode="numeric" placeholder={ex.r} value={s.reps} onChange={(e) => updateSet(i, "reps", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") weightRefs.current[i + 1]?.focus(); }} onBlur={() => { if (s.reps) weightRefs.current[i + 1]?.focus(); }} />
              <button style={styles.iconButton} onClick={() => removeSet(i)}><Trash2 size={14} color={COLORS.textDim} /></button>
            </div>
            {showNotes && <input style={styles.noteInput} placeholder="note (optional)" value={s.note} onChange={(e) => updateSet(i, "note", e.target.value)} />}
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button style={styles.secondaryButton} onClick={addSet}><Plus size={14} style={{ verticalAlign: "-2px" }} /> Set</button>
          <button style={styles.secondaryButton} onClick={() => setShowNotes((v) => !v)}>{showNotes ? "Hide notes" : "Notes"}</button>
        </div>
        {error && <div role="alert" style={{ ...styles.dimLabel, color: COLORS.red, marginTop: 10 }}>{error}</div>}
        <button style={{ ...styles.primaryButton, width: "100%", marginTop: 12 }} onClick={saveSession}>{todaySession ? "Update session" : "Save session"}</button>
      </div>
      {sessions.length > 0 && (
        <div style={styles.card}>
          <div style={styles.sectionHeader} onClick={() => setShowHistory((v) => !v)}>
            <span style={styles.sectionTitle}>History</span>
            {showHistory ? <ChevronUp size={16} color={COLORS.textDim} /> : <ChevronDown size={16} color={COLORS.textDim} />}
          </div>
          {showHistory && <div style={{ marginTop: 8 }}>{sessions.slice().reverse().map((s, i) => (
            <div key={i} style={styles.histRow}><span style={styles.dimLabel}>{s.date}</span><span style={{ fontFamily: FONT_NUM, fontSize: 13 }}>{s.sets.map((st) => `${st.weight || "—"}×${st.reps || "—"}`).join("  ")}</span></div>
          ))}</div>}
        </div>
      )}
    </div>
  );
}

// ============ FOOD TAB ============
function foodKey(food) {
  return food?.savedId || food?.id || (food?.name || "").toLowerCase().trim();
}

function FoodTab({ totals, targets, setTargets, todaysEntries, dayLog, copyPreviousDay, addEntry, removeEntry, myFoods, saveCustomFood, deleteFood, servingPrefs }) {
  const [editingTargets, setEditingTargets] = useState(false);
  const [activeAdd, setActiveAdd] = useState(null);
  const remaining = Math.round(targets.calories - totals.calories);
  const yesterday = previousDateKey(todayKey());
  const canCopyYesterday = MEAL_SECTIONS.some((section) => (dayLog[yesterday]?.[section.id] || []).length > 0);
  const todayIsEmpty = MEAL_SECTIONS.every((section) => (todaysEntries[section.id] || []).length === 0);
  const recentFoods = [];
  const seen = new Set();
  Object.keys(dayLog).sort().reverse().forEach((date) => MEAL_SECTIONS.forEach((section) => {
    (dayLog[date]?.[section.id] || []).slice().reverse().forEach((food) => {
      const key = `${food.name}|${food.calories}|${food.protein}|${food.carbs}|${food.fat}`;
      if (!seen.has(key) && recentFoods.length < 8) { seen.add(key); recentFoods.push(food); }
    });
  }));
  return (
    <div style={styles.tabContent}>
      <DailySummary totals={totals} targets={targets} remaining={remaining} onEditTargets={() => setEditingTargets(true)} />
      <NutritionHistory dayLog={dayLog} targets={targets} />
      {editingTargets && <TargetsEditor targets={targets} setTargets={setTargets} onClose={() => setEditingTargets(false)} />}
      {todayIsEmpty && canCopyYesterday && <button style={styles.secondaryButton} onClick={copyPreviousDay}><Copy size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />Copy yesterday</button>}
      {MEAL_SECTIONS.map((sec) => (
        <MealSection key={sec.id} section={sec} items={todaysEntries[sec.id] || []} onAdd={() => setActiveAdd(sec.id)} onRemove={(id) => removeEntry(sec.id, id)} />
      ))}
      {activeAdd && <AddFoodModal sectionLabel={MEAL_SECTIONS.find((s) => s.id === activeAdd)?.label} myFoods={myFoods} recentFoods={recentFoods} deleteFood={deleteFood} servingPrefs={servingPrefs} onClose={() => setActiveAdd(null)} onAdd={(entry, save) => { addEntry(activeAdd, entry); if (save) saveCustomFood(entry); setActiveAdd(null); }} onSaveRecipe={(recipe) => { saveCustomFood(recipe); }} />}
    </div>
  );
}

function NutritionHistory({ dayLog, targets }) {
  const rows = Object.keys(dayLog || {}).sort().map((date) => ({ date, ...dayTotals(dayLog[date]) })).filter((d) => d.calories > 0 || d.protein > 0);
  const last7 = rows.slice(-7);
  const last30 = rows.slice(-30);
  const avg = (arr, k) => arr.length ? Math.round(arr.reduce((s, d) => s + (d[k] || 0), 0) / arr.length) : 0;
  const hitCount = (arr, k, target, pct = 0.9) => arr.filter((d) => (d[k] || 0) >= target * pct).length;
  const overDays = rows.reduce((acc, d) => {
    if ((d.calories || 0) > targets.calories * 1.05) {
      const day = new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
      acc[day] = (acc[day] || 0) + 1;
    }
    return acc;
  }, {});
  const topOver = Object.entries(overDays).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Nutrition History</div>
      {rows.length === 0 ? <div style={styles.emptyHint}>Log food for a few days to unlock trends.</div> : (
        <>
          <div style={styles.historyGrid}>
            <div><div style={styles.statBig}>{avg(last7, "calories")}</div><div style={styles.statLabel}>7-day avg cal</div></div>
            <div><div style={styles.statBig}>{avg(last7, "protein")}g</div><div style={styles.statLabel}>7-day avg protein</div></div>
            <div><div style={styles.statBig}>{hitCount(last7, "protein", targets.protein)}/{last7.length}</div><div style={styles.statLabel}>protein hits</div></div>
            <div><div style={styles.statBig}>{avg(last30, "calories")}</div><div style={styles.statLabel}>30-day avg cal</div></div>
          </div>
          <div style={{ marginTop: 12 }}>
            {last7.map((d) => {
              const pct = Math.min((d.calories || 0) / (targets.calories || 1), 1.25);
              return (
                <div key={d.date} style={styles.nutritionDayRow}>
                  <span style={{ ...styles.dimLabel, width: 46 }}>{d.date.slice(5)}</span>
                  <div style={styles.historyBarTrack}><div style={{ ...styles.historyBarFill, width: `${Math.min(pct, 1) * 100}%`, background: pct > 1.05 ? COLORS.red : COLORS.amber }} /></div>
                  <span style={{ ...styles.foodMacros, width: 78, textAlign: "right" }}>{Math.round(d.calories)} cal</span>
                </div>
              );
            })}
          </div>
          <div style={styles.helpNote}>
            {topOver ? `${topOver[0]} is your most common over-target day in logged history.` : "Macro consistency insights improve as more days are logged."}
          </div>
        </>
      )}
    </div>
  );
}

function DailySummary({ totals, targets, remaining, onEditTargets }) {
  const proteinKcal = totals.protein * 4, carbsKcal = totals.carbs * 4, fatKcal = totals.fat * 9;
  const totalKcal = Math.max(proteinKcal + carbsKcal + fatKcal, 1);
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div><div style={styles.bigNumber}>{Math.round(totals.calories)}</div><div style={styles.dimLabel}>of {targets.calories} cal</div></div>
        <div style={{ textAlign: "right" }}><div style={{ ...styles.bigNumber, color: remaining < 0 ? COLORS.red : COLORS.amber, fontSize: 22 }}>{remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}</div><div style={styles.dimLabel}>{remaining >= 0 ? "remaining" : "over"}</div></div>
      </div>
      <div style={styles.stackedBarTrack}>
        <div style={{ ...styles.stackedBarSeg, width: `${(proteinKcal / totalKcal) * 100}%`, background: COLORS.blue }} />
        <div style={{ ...styles.stackedBarSeg, width: `${(carbsKcal / totalKcal) * 100}%`, background: COLORS.amber }} />
        <div style={{ ...styles.stackedBarSeg, width: `${(fatKcal / totalKcal) * 100}%`, background: COLORS.pink }} />
      </div>
      <div style={styles.macroRow}>
        <MacroStat label="Protein" value={totals.protein} target={targets.protein} color={COLORS.blue} />
        <MacroStat label="Carbs" value={totals.carbs} target={targets.carbs} color={COLORS.amber} />
        <MacroStat label="Fat" value={totals.fat} target={targets.fat} color={COLORS.pink} />
      </div>
      <button style={styles.linkButton} onClick={onEditTargets}>Edit targets</button>
    </div>
  );
}
function MacroStat({ label, value, target, color }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: color }} /><span style={{ fontSize: 12, color: COLORS.textDim }}>{label}</span></div>
      <div style={styles.tabularNum}>{Math.round(value)}<span style={{ color: COLORS.textDim, fontSize: 13 }}>/{target}g</span></div>
    </div>
  );
}
function TargetsEditor({ targets, setTargets, onClose }) {
  const [local, setLocal] = useState(targets);
  const [error, setError] = useState("");
  function save() {
    if (!Number.isFinite(Number(local.calories)) || Number(local.calories) <= 0 || ["protein", "carbs", "fat"].some((key) => !isNonNegativeNumber(local[key]))) {
      setError("Calories must be greater than 0. Macro targets cannot be negative.");
      return;
    }
    setTargets(Object.fromEntries(Object.entries(local).map(([key, value]) => [key, Number(value)])));
    onClose();
  }
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>Daily Targets</div>
      {["calories", "protein", "carbs", "fat"].map((k) => (
        <div key={k} style={styles.fieldRow}><label style={styles.fieldLabel}>{k === "calories" ? "Calories" : k[0].toUpperCase() + k.slice(1) + " (g)"}</label><input type="number" min="0" value={local[k]} onChange={(e) => setLocal({ ...local, [k]: e.target.value })} style={styles.input} /></div>
      ))}
      {error && <div role="alert" style={{ ...styles.dimLabel, color: COLORS.red }}>{error}</div>}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}><button style={styles.primaryButton} onClick={save}>Save</button><button style={styles.secondaryButton} onClick={onClose}>Cancel</button></div>
    </div>
  );
}
function MealSection({ section, items, onAdd, onRemove }) {
  const [open, setOpen] = useState(true);
  const subtotal = items.reduce((s, i) => s + (i.calories || 0), 0);
  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>{open ? <ChevronUp size={16} color={COLORS.textDim} /> : <ChevronDown size={16} color={COLORS.textDim} />}<span style={styles.sectionTitle}>{section.label}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={styles.dimLabel}>{Math.round(subtotal)} cal</span><button style={styles.addCircleButton} onClick={(e) => { e.stopPropagation(); onAdd(); }}><Plus size={16} color={COLORS.bg} strokeWidth={2.5} /></button></div>
      </div>
      {open && items.length > 0 && <div style={{ marginTop: 8 }}>{items.map((item) => (
        <div key={item.id} style={styles.foodRow}><div style={{ flex: 1, minWidth: 0 }}><div style={styles.foodName}>{item.name}</div><div style={styles.foodMacros}>{Math.round(item.calories)} cal · P{Math.round(item.protein)} C{Math.round(item.carbs)} F{Math.round(item.fat)}</div></div><button style={styles.iconButton} onClick={() => onRemove(item.id)}><Trash2 size={15} color={COLORS.textDim} /></button></div>
      ))}</div>}
      {open && items.length === 0 && <button style={{ ...styles.linkButton, marginTop: 10 }} onClick={onAdd}>Add {section.label.toLowerCase()}</button>}
    </div>
  );
}

function ServingStepper({ value, onChange }) {
  const steps = [0.25, 0.5, 1, 2, 3, 4, 5];
  const current = Number(value) || 1;
  const move = (dir) => {
    const sorted = steps.slice().sort((a, b) => a - b);
    if (dir < 0) {
      const next = [...sorted].reverse().find((s) => s < current);
      onChange(next || Math.max(0.25, current - 0.25));
    } else {
      const next = sorted.find((s) => s > current);
      onChange(next || current + 1);
    }
  };
  return (
    <div>
      <div style={styles.servingStepper}>
        <button style={styles.stepButton} onClick={() => move(-1)}><ChevronLeft size={18} color={COLORS.text} /></button>
        <input type="number" step="0.25" min="0.25" value={current} onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))} style={styles.servingValue} />
        <button style={styles.stepButton} onClick={() => move(1)}><ChevronRight size={18} color={COLORS.text} /></button>
      </div>
      <div style={styles.quickServingRow}>
        {steps.map((s) => (
          <button key={s} style={{ ...styles.quickServingBtn, ...(current === s ? styles.quickServingBtnOn : {}) }} onClick={() => onChange(s)}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function AddFoodModal({ sectionLabel, myFoods, recentFoods, deleteFood, servingPrefs, onClose, onAdd, onSaveRecipe }) {
  const [mode, setMode] = useState(recentFoods.length > 0 ? "recent" : myFoods.length > 0 ? "myfoods" : "custom");
  const [selected, setSelected] = useState(null);
  const [servings, setServings] = useState(1);
  function selectFood(f) { setSelected(f); setServings(servingPrefs?.[foodKey(f)] || 1); }
  function confirmAdd(save) {
    if (!selected || !(servings > 0)) return;
    onAdd({ name: selected.name, calories: selected.calories * servings, protein: selected.protein * servings, carbs: selected.carbs * servings, fat: selected.fat * servings, servings, foodKey: foodKey(selected) }, save);
  }
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalSheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}><span style={styles.modalTitle}>Add to {sectionLabel}</span><button style={styles.iconButton} onClick={onClose}><X size={18} color={COLORS.textDim} /></button></div>
        {selected ? (
          <div style={{ padding: "4px 0" }}>
            <div style={styles.foodName}>{selected.name}</div>
            <div style={{ ...styles.dimLabel, marginBottom: 12 }}>{selected.servingNote || "per serving"}</div>
            <div style={styles.fieldRow}>
              <label style={styles.fieldLabel}>Servings</label>
              <ServingStepper value={servings} onChange={setServings} />
            </div>
            <div style={{ display: "flex", gap: 16, margin: "12px 0", fontSize: 13, color: COLORS.textDim }}><span>{Math.round(selected.calories * servings)} cal</span><span>P{Math.round(selected.protein * servings)}</span><span>C{Math.round(selected.carbs * servings)}</span><span>F{Math.round(selected.fat * servings)}</span></div>
            {!(servings > 0) && <div style={{ ...styles.dimLabel, color: COLORS.amber, marginBottom: 8 }}>Enter a serving amount greater than 0.</div>}
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...styles.primaryButton, flex: 1, opacity: servings > 0 ? 1 : 0.5 }} disabled={!(servings > 0)} onClick={() => confirmAdd(false)}>Add to Today</button>
              {!selected.id && <button style={{ ...styles.secondaryButton, opacity: servings > 0 ? 1 : 0.5 }} disabled={!(servings > 0)} onClick={() => confirmAdd(true)}>Save as Recipe</button>}
            </div>
            <button style={{ ...styles.linkButton, marginTop: 10 }} onClick={() => setSelected(null)}>Back</button>
          </div>
        ) : (
          <>
            <div style={styles.modeSwitch}>{["recent", "myfoods", "custom", "recipe"].map((m) => (<button key={m} style={{ ...styles.modeButton, ...(mode === m ? styles.modeButtonActive : {}) }} onClick={() => setMode(m)}>{m === "recent" ? "Recent" : m === "myfoods" ? "Saved" : m === "custom" ? "Custom" : "Recipe"}</button>))}</div>
            {mode === "recent" && (
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {recentFoods.length === 0 && <div style={styles.emptyHint}>Foods you log will appear here for quick reuse.</div>}
                {recentFoods.map((food, index) => <button key={`${food.name}-${index}`} style={styles.resultRow} onClick={() => selectFood(food)}><div style={{ textAlign: "left" }}><div style={styles.foodName}>{food.name}</div><div style={styles.foodMacros}>{Math.round(food.calories)} cal Â· P{Math.round(food.protein)} C{Math.round(food.carbs)} F{Math.round(food.fat)}</div></div></button>)}
              </div>
            )}
            {mode === "myfoods" && (
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {myFoods.length === 0 && <div style={styles.emptyHint}>No saved foods yet. Add via Custom or build a Recipe.</div>}
                {myFoods.map((f) => (
                  <div key={f.id} style={{ ...styles.resultRow, display: "flex", alignItems: "center" }}>
                    <button style={{ flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }} onClick={() => selectFood(f)}>
                      <div style={styles.foodName}>{f.name}{f.isRecipe ? <span style={{ ...styles.dimLabel, marginLeft: 6, fontSize: 11 }}>recipe</span> : null}</div>
                      <div style={styles.foodMacros}>{Math.round(f.calories)} cal · P{Math.round(f.protein)} C{Math.round(f.carbs)} F{Math.round(f.fat)}</div>
                    </button>
                    <button style={styles.iconButton} onClick={() => deleteFood(f.id)}><Trash2 size={14} color={COLORS.textDim} /></button>
                  </div>
                ))}
              </div>
            )}
            {mode === "custom" && <CustomFoodForm onSelect={selectFood} />}
            {mode === "recipe" && <RecipeBuilder myFoods={myFoods} onSave={(recipe) => { onSaveRecipe(recipe); selectFood(recipe); }} />}
          </>
        )}
      </div>
    </div>
  );
}

function RecipeBuilder({ myFoods, onSave }) {
  const [name, setName] = useState("");
  const [totalServings, setTotalServings] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [picking, setPicking] = useState(false);
  const [qty, setQty] = useState({});

  const totals = ingredients.reduce((acc, f) => {
    const q = Number(qty[f.id]) || 1;
    acc.cal += (f.calories || 0) * q;
    acc.p += (f.protein || 0) * q;
    acc.c += (f.carbs || 0) * q;
    acc.f += (f.fat || 0) * q;
    return acc;
  }, { cal: 0, p: 0, c: 0, f: 0 });
  const sv = Math.max(Number(totalServings) || 1, 0.01);
  const perServing = { calories: totals.cal / sv, protein: totals.p / sv, carbs: totals.c / sv, fat: totals.f / sv };

  function addIngredient(f) {
    if (!ingredients.find((i) => i.id === f.id)) {
      setIngredients((prev) => [...prev, f]);
      setQty((prev) => ({ ...prev, [f.id]: 1 }));
    }
    setPicking(false);
  }
  function removeIngredient(id) {
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    setQty((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  function save() {
    if (!name.trim() || ingredients.length === 0) return;
    onSave({ name: name.trim(), calories: Math.round(perServing.calories), protein: Math.round(perServing.protein * 10) / 10, carbs: Math.round(perServing.carbs * 10) / 10, fat: Math.round(perServing.fat * 10) / 10, servingNote: "1 serving", isRecipe: true });
  }

  if (picking) {
    const available = myFoods.filter((f) => !ingredients.find((i) => i.id === f.id));
    return (
      <div>
        <div style={styles.modalHeader}><span style={styles.modalTitle}>Pick ingredient</span><button style={styles.iconButton} onClick={() => setPicking(false)}><X size={18} color={COLORS.textDim} /></button></div>
        <div style={{ maxHeight: 280, overflowY: "auto" }}>
          {available.length === 0 && <div style={styles.emptyHint}>No more saved foods to add.</div>}
          {available.map((f) => (
            <button key={f.id} style={styles.resultRow} onClick={() => addIngredient(f)}>
              <div style={{ flex: 1, textAlign: "left" }}><div style={styles.foodName}>{f.name}</div><div style={styles.foodMacros}>{Math.round(f.calories)} cal · P{Math.round(f.protein)} C{Math.round(f.carbs)} F{Math.round(f.fat)}</div></div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {myFoods.length === 0 && <div style={{ ...styles.emptyHint, color: COLORS.amber, marginBottom: 10 }}>Save individual foods first (via Custom tab), then combine them here.</div>}
      <div style={styles.fieldRow}><label style={styles.fieldLabel}>Recipe name</label><input placeholder="e.g. Protein Shake" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} /></div>
      <div style={styles.fieldRow}><label style={styles.fieldLabel}>Servings this makes</label><input type="number" step="0.5" min="0.5" value={totalServings} onChange={(e) => setTotalServings(e.target.value)} style={{ ...styles.input, width: 80 }} /></div>
      <div style={{ marginTop: 10 }}>
        {ingredients.length === 0 && <div style={styles.emptyHint}>No ingredients yet.</div>}
        {ingredients.map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1, fontSize: 13, color: COLORS.text }}>{f.name}</div>
            <input type="number" step="0.25" min="0.25" value={qty[f.id] ?? 1} onChange={(e) => setQty((prev) => ({ ...prev, [f.id]: e.target.value }))} style={{ ...styles.input, width: 60, padding: "4px 8px" }} />
            <span style={{ fontSize: 12, color: COLORS.textDim }}>×</span>
            <button style={styles.iconButton} onClick={() => removeIngredient(f.id)}><Trash2 size={14} color={COLORS.textDim} /></button>
          </div>
        ))}
      </div>
      <button style={{ ...styles.secondaryButton, width: "100%", marginTop: 6 }} onClick={() => setPicking(true)} disabled={myFoods.length === 0}>+ Add ingredient</button>
      {ingredients.length > 0 && (
        <div style={{ margin: "12px 0", fontSize: 13, color: COLORS.textDim }}>
          Per serving: {Math.round(perServing.calories)} cal · P{Math.round(perServing.protein)} C{Math.round(perServing.carbs)} F{Math.round(perServing.fat)}
        </div>
      )}
      <button style={{ ...styles.primaryButton, width: "100%", marginTop: 4, opacity: name.trim() && ingredients.length > 0 ? 1 : 0.5 }} disabled={!name.trim() || ingredients.length === 0} onClick={save}>Save recipe &amp; add to log</button>
    </div>
  );
}

function CustomFoodForm({ onSelect }) {
  const [form, setForm] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [error, setError] = useState("");
  function submit() {
    const values = ["calories", "protein", "carbs", "fat"];
    if (!form.name.trim() || values.some((key) => !isNonNegativeNumber(form[key])) || values.every((key) => Number(form[key]) === 0)) {
      setError("Enter a name and non-negative nutrition values. At least one value must be greater than 0.");
      return;
    }
    onSelect({ name: form.name.trim(), calories: Number(form.calories), protein: Number(form.protein), carbs: Number(form.carbs), fat: Number(form.fat), servingNote: "custom entry" });
  }
  return (
    <div>
      <div style={styles.fieldRow}><label style={styles.fieldLabel}>Name</label><input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      {["calories", "protein", "carbs", "fat"].map((k) => (<div key={k} style={styles.fieldRow}><label style={styles.fieldLabel}>{k === "calories" ? "Calories" : k[0].toUpperCase() + k.slice(1) + " (g)"}</label><input type="number" min="0" style={styles.input} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>))}
      {error && <div role="alert" style={{ ...styles.dimLabel, color: COLORS.red, marginBottom: 10 }}>{error}</div>}
      <button style={styles.primaryButton} onClick={submit}>Continue</button>
    </div>
  );
}

// ============ WEIGHT TAB ============
function WeightChart({ sorted, goalWeight }) {
  const W = 360, H = 190;
  const ml = 40, mt = 18, mr = 14, mb = 34;
  const cw = W - ml - mr, ch = H - mt - mb;

  const allVals = sorted.map((w) => w.lbs);
  if (goalWeight != null) allVals.push(Number(goalWeight));
  const rawMin = Math.min(...allVals), rawMax = Math.max(...allVals);
  const pad = Math.max((rawMax - rawMin) * 0.15, 3);
  const yLo = rawMin - pad, yHi = rawMax + pad;
  const yRange = yHi - yLo || 1;

  const xOf = (i) => ml + (sorted.length > 1 ? (i / (sorted.length - 1)) * cw : cw / 2);
  const yOf = (v) => mt + (1 - (v - yLo) / yRange) * ch;

  const linePts = sorted.map((w, i) => `${xOf(i).toFixed(1)},${yOf(w.lbs).toFixed(1)}`).join(" ");
  const areaPts = `${xOf(0).toFixed(1)},${(mt + ch).toFixed(1)} ${linePts} ${xOf(sorted.length - 1).toFixed(1)},${(mt + ch).toFixed(1)}`;

  const yTicks = [0, 1, 2, 3].map((i) => yLo + (i / 3) * yRange);

  const rawIdxs = sorted.length <= 5
    ? sorted.map((_, i) => i)
    : [0, Math.round((sorted.length - 1) / 3), Math.round(2 * (sorted.length - 1) / 3), sorted.length - 1];
  const xLabelIdxs = [...new Set(rawIdxs)];

  const gw = goalWeight != null ? Number(goalWeight) : null;
  const gwY = gw != null ? yOf(gw) : null;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block", marginTop: 8 }}>
      <defs>
        <linearGradient id="wAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.22" />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map((v, i) => (
        <line key={i} x1={ml} y1={yOf(v).toFixed(1)} x2={ml + cw} y2={yOf(v).toFixed(1)} stroke={COLORS.cardBorder} strokeWidth="1" />
      ))}
      {gw != null && (
        <>
          <line x1={ml} y1={gwY.toFixed(1)} x2={ml + cw} y2={gwY.toFixed(1)} stroke={COLORS.amber} strokeWidth="1.5" strokeDasharray="5 3" opacity="0.85" />
          <text x={ml + cw} y={(gwY - 4).toFixed(1)} fill={COLORS.amber} fontSize="9.5" textAnchor="end" opacity="0.9">goal {gw}</text>
        </>
      )}
      {sorted.length > 1 && <polygon points={areaPts} fill="url(#wAreaGrad)" />}
      {sorted.length > 1 && (
        <polyline points={linePts} fill="none" stroke={COLORS.blue} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      )}
      {sorted.map((w, i) => (
        <circle key={i} cx={xOf(i).toFixed(1)} cy={yOf(w.lbs).toFixed(1)} r="3.5" fill={COLORS.blue} stroke={COLORS.bg} strokeWidth="2" />
      ))}
      {yTicks.map((v, i) => (
        <text key={i} x={ml - 5} y={(yOf(v) + 4).toFixed(1)} fill={COLORS.textDim} fontSize="10" textAnchor="end">{Math.round(v)}</text>
      ))}
      {xLabelIdxs.map((i) => (
        <text key={i} x={xOf(i).toFixed(1)} y={H - 6} fill={COLORS.textDim} fontSize="10" textAnchor="middle">{sorted[i].date.slice(5)}</text>
      ))}
    </svg>
  );
}

function WeightTab({ weights, setWeights, profile, setProfiles }) {
  const [val, setVal] = useState("");
  const [error, setError] = useState("");
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  const latest = sorted[sorted.length - 1], prior = sorted[sorted.length - 2];
  const delta = latest && prior ? latest.lbs - prior.lbs : null;
  function addWeight() {
    const lbs = Number(val);
    if (!Number.isFinite(lbs) || lbs <= 0 || lbs > 1000) { setError("Enter a weight between 0 and 1,000 lbs."); return; }
    setError(""); const date = todayKey();
    setWeights((prev) => [...prev.filter((w) => w.date !== date), { date, lbs }]);
    // capture start weight once
    if (profile.startWeight == null) setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, startWeight: lbs } : p));
    setVal("");
  }
  const [goalInput, setGoalInput] = useState(profile.goalWeight ?? "");
  function saveGoal() {
    const g = goalInput === "" ? null : Number(goalInput);
    if (g !== null && (!Number.isFinite(g) || g <= 0 || g > 1000)) { setError("Enter a goal between 0 and 1,000 lbs."); return; }
    setError("");
    setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, goalWeight: g } : p));
  }
  return (
    <div style={styles.tabContent}>
      <div style={styles.card}><div style={styles.cardHeader}>Log Weight</div><div style={{ display: "flex", gap: 8 }}><input type="number" min="0" max="1000" step="0.1" placeholder="lbs" value={val} onChange={(e) => setVal(e.target.value)} style={{ ...styles.input, flex: 1 }} /><button style={styles.primaryButton} onClick={addWeight}>Log</button></div>{error && <div role="alert" style={{ ...styles.dimLabel, color: COLORS.red, marginTop: 8 }}>{error}</div>}</div>
      {latest && <div style={styles.card}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}><div><div style={styles.bigNumber}>{latest.lbs}<span style={{ fontSize: 16, color: COLORS.textDim }}> lbs</span></div><div style={styles.dimLabel}>as of {latest.date}</div></div>{delta !== null && <div style={{ ...styles.dimLabel, color: delta > 0 ? COLORS.red : COLORS.blue }}>{delta > 0 ? "+" : ""}{delta.toFixed(1)} lbs</div>}</div></div>}
      <div style={styles.card}><div style={styles.cardHeader}>Goal Weight</div><div style={{ display: "flex", gap: 8 }}><input type="number" step="0.1" placeholder="goal lbs" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} style={{ ...styles.input, flex: 1 }} /><button style={styles.primaryButton} onClick={saveGoal}>Set</button></div>{profile.startWeight != null && profile.goalWeight != null && <div style={{ ...styles.dimLabel, marginTop: 8 }}>Start {profile.startWeight} → Goal {profile.goalWeight} lbs</div>}</div>
      {sorted.length > 0 && <div style={styles.card}><div style={styles.cardHeader}>Trend</div><WeightChart sorted={sorted} goalWeight={profile.goalWeight} /></div>}
      <div style={styles.card}><div style={styles.cardHeader}>History</div>{sorted.length === 0 && <div style={styles.emptyHint}>No weight logged yet</div>}{sorted.slice().reverse().map((w) => (<div key={w.date} style={styles.foodRow}><div style={{ flex: 1 }}>{w.date}</div><div style={styles.tabularNum}>{w.lbs} lbs</div></div>))}</div>
    </div>
  );
}

// ============ STATS ENGINE (drives dashboard callouts) ============
function daysAgo(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}
function flattenSessions(workoutLogs, plans) {
  const out = [];
  Object.entries(workoutLogs || {}).forEach(([key, val]) => {
    const parts = key.split("|");
    const planId = parts[0];
    const exName = parts[parts.length - 1];
    const zones = exerciseZones(plans, planId, exName);
    (val.sessions || []).forEach((s) => out.push({ ...s, exName, planId, zones }));
  });
  return out;
}
function exerciseZones(plans, planId, exName) {
  const plan = (plans || []).find((p) => p.id === planId);
  if (!plan) return {};
  const scan = (days) => { for (const d of days) { for (const e of d.ex) { if (e.n === exName) return e.mz || {}; } } return null; };
  if (plan.structure === "weeks") { for (const w of plan.weeks) { const z = scan(w.days); if (z) return z; } return {}; }
  return scan(plan.days) || {};
}
function sessionVolume(s) {
  return (s.sets || []).reduce((sum, st) => sum + (parseFloat(st.weight) || 0) * (parseInt(st.reps) || 0), 0);
}
function dayTotals(entries) {
  return Object.values(entries || {}).flat().reduce((a, it) => ({ calories: a.calories + (it.calories || 0), protein: a.protein + (it.protein || 0) }), { calories: 0, protein: 0 });
}
function computeStats({ profile, weights, workoutLogs, dayLog, plans, targets }) {
  const sessions = flattenSessions(workoutLogs, plans);
  const within = (n) => sessions.filter((s) => daysAgo(s.date) < n);
  const distinctDates = (arr) => new Set(arr.map((s) => s.date));

  const workoutDatesAll = distinctDates(sessions);
  const totalWorkouts = workoutDatesAll.size;
  const workoutsThisWeek = distinctDates(within(7)).size;

  // best week ever: scan weekly buckets
  let bestWeekEver = 0;
  if (sessions.length) {
    const byWeek = {};
    sessions.forEach((s) => { const wk = Math.floor(daysAgo(s.date) / 7); (byWeek[wk] = byWeek[wk] || new Set()).add(s.date); });
    bestWeekEver = Math.max(...Object.values(byWeek).map((set) => set.size));
  }

  const weekVolume = Math.round(within(7).reduce((a, s) => a + sessionVolume(s), 0));
  const totalVolume = Math.round(sessions.reduce((a, s) => a + sessionVolume(s), 0));

  // PRs in last 7 days: a set beating all earlier weights for that exercise
  let recentPRs = 0, lastPRname = "";
  const byEx = {};
  sessions.slice().sort((a, b) => a.date.localeCompare(b.date)).forEach((s) => {
    const maxThis = Math.max(0, ...(s.sets || []).map((st) => parseFloat(st.weight) || 0));
    const prev = byEx[s.exName] || 0;
    if (maxThis > prev && prev > 0 && daysAgo(s.date) < 7) { recentPRs++; lastPRname = titleCase(s.exName); }
    byEx[s.exName] = Math.max(prev, maxThis);
  });

  // top lift gain (Back Squat-ish): pick exercise with most sessions, compare first vs best
  let topLiftName = "", topLiftGain = 0;
  const exSessions = {};
  sessions.forEach((s) => { (exSessions[s.exName] = exSessions[s.exName] || []).push(s); });
  Object.entries(exSessions).forEach(([name, ss]) => {
    if (ss.length < 2) return;
    const sorted = ss.slice().sort((a, b) => a.date.localeCompare(b.date));
    const first = Math.max(0, ...(sorted[0].sets || []).map((st) => parseFloat(st.weight) || 0));
    const best = Math.max(...sorted.flatMap((s) => (s.sets || []).map((st) => parseFloat(st.weight) || 0)));
    const gain = best - first;
    if (gain > topLiftGain) { topLiftGain = gain; topLiftName = titleCase(name); }
  });

  // weight progress
  const sortedW = [...(weights || [])].sort((a, b) => a.date.localeCompare(b.date));
  const current = sortedW.length ? sortedW[sortedW.length - 1].lbs : null;
  const start = profile.startWeight ?? (sortedW.length ? sortedW[0].lbs : null);
  const goal = profile.goalWeight ?? null;
  let goalPctLost = 0, totalLost = 0, lbsToGoal = 0, weekChange = 0;
  if (current != null && start != null) totalLost = +(start - current).toFixed(1);
  if (current != null && start != null && goal != null && start !== goal) {
    goalPctLost = Math.max(0, Math.min(100, Math.round(((start - current) / (start - goal)) * 100)));
    lbsToGoal = +(current - goal).toFixed(1);
  }
  const wkAgo = sortedW.filter((w) => daysAgo(w.date) >= 7)[0] || sortedW[0];
  if (current != null && wkAgo) weekChange = +(current - wkAgo.lbs).toFixed(1);

  // macro streaks from dayLog
  let proteinHitStreak = 0, calorieHitStreak = 0, loggedMealsToday = 0;
  const dates = Object.keys(dayLog || {}).sort().reverse();
  const todayEntries = dayLog[todayKey()] || {};
  loggedMealsToday = Object.values(todayEntries).filter((arr) => arr && arr.length).length;
  for (const dt of dates) {
    const t = dayTotals(dayLog[dt]);
    if (t.protein >= (targets.protein * 0.9)) proteinHitStreak++; else break;
  }
  for (const dt of dates) {
    const t = dayTotals(dayLog[dt]);
    if (t.calories > 0 && t.calories <= targets.calories * 1.05) calorieHitStreak++; else break;
  }

  // logging streak (workout OR food on consecutive days up to today)
  const activeDates = new Set([...workoutDatesAll, ...Object.keys(dayLog || {}).filter((d) => Object.values(dayLog[d]).some((a) => a && a.length))]);
  let loggingStreak = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (activeDates.has(key)) loggingStreak++; else if (i > 0) break;
  }
  const lastWorkoutDate = [...workoutDatesAll].sort().reverse()[0];
  const daysSinceLastWorkout = lastWorkoutDate ? daysAgo(lastWorkoutDate) : 99;

  // heatmap-derived balance
  const heat = computeHeatmap(workoutLogs, plans, 7);
  const trained = Object.entries(heat).filter(([, v]) => v > 0).map(([z]) => z);
  const neglectedZone = totalWorkouts > 0 ? ZONES.find((z) => !trained.includes(z)) : null;
  const isBalanced = trained.length >= ZONES.length - 1;

  return { totalWorkouts, workoutsThisWeek, bestWeekEver, weekVolume, totalVolume, recentPRs, lastPRname, topLiftName, topLiftGain, goalPctLost, totalLost, lbsToGoal, weekChange, weighInStreak: 0, proteinHitStreak, calorieHitStreak, loggedMealsToday, loggingStreak, daysSinceLastWorkout, neglectedZone, isBalanced };
}

// ============ HEATMAP AGGREGATION ============
function computeHeatmap(workoutLogs, plans, windowDays) {
  const acc = {}; ZONES.forEach((z) => acc[z] = 0);
  const sessions = flattenSessions(workoutLogs, plans);
  sessions.forEach((s) => {
    if (daysAgo(s.date) >= windowDays) return;
    const setCount = (s.sets || []).filter((st) => st.weight || st.reps).length || (s.sets || []).length;
    Object.entries(s.zones || {}).forEach(([z, w]) => { if (acc[z] != null) acc[z] += setCount * w; });
  });
  return acc;
}

// ============ CALLOUT RULES ============
const CALLOUT_RULES = [
  { id: "wt_goal_pct", test: c => c.goalPctLost >= 1 && c.goalPctLost < 50, msg: c => `You've reached ${c.goalPctLost}% of your weight goal. Keep it up.`, pri: 9 },
  { id: "wt_halfway", test: c => c.goalPctLost >= 50 && c.goalPctLost < 90, msg: c => `Halfway to your goal weight. The hard part's behind you.`, pri: 10 },
  { id: "wt_near", test: c => c.goalPctLost >= 90, msg: c => `Less than ${Math.abs(c.lbsToGoal)} lbs from your goal. So close.`, pri: 10 },
  { id: "wt_down", test: c => c.totalLost >= 1, msg: c => `Down ${c.totalLost} lbs since you started.`, pri: 7 },
  { id: "wt_weekdrop", test: c => c.weekChange <= -0.5, msg: c => `Dropped ${Math.abs(c.weekChange)} lbs in the last week.`, pri: 6 },
  { id: "wo_week", test: c => c.workoutsThisWeek >= 3, msg: c => `${c.workoutsThisWeek} workouts this week. Dialed in.`, pri: 7 },
  { id: "wo_best", test: c => c.workoutsThisWeek >= c.bestWeekEver && c.workoutsThisWeek >= 4, msg: c => `${c.workoutsThisWeek} workouts. Your best week yet.`, pri: 9 },
  { id: "wo_10", test: c => c.totalWorkouts >= 10 && c.totalWorkouts < 50, msg: c => `${c.totalWorkouts} workouts logged all-time.`, pri: 5 },
  { id: "wo_50", test: c => c.totalWorkouts >= 50 && c.totalWorkouts < 100, msg: c => `50+ workouts in the books. Consistency pays.`, pri: 9 },
  { id: "wo_100", test: c => c.totalWorkouts >= 100, msg: c => `${c.totalWorkouts} workouts logged. Elite consistency.`, pri: 10 },
  { id: "streak", test: c => c.loggingStreak >= 5, msg: c => `${c.loggingStreak}-day logging streak. Don't break it now.`, pri: 8 },
  { id: "vol_week", test: c => c.weekVolume >= 10000, msg: c => `You moved ${c.weekVolume.toLocaleString()} lbs this week.`, pri: 7 },
  { id: "vol_total", test: c => c.totalVolume >= 100000, msg: c => `${Math.round(c.totalVolume / 1000)}k lbs moved all-time.`, pri: 8 },
  { id: "pr", test: c => c.recentPRs >= 1, msg: c => c.recentPRs === 1 ? `New PR this week on ${c.lastPRname}.` : `${c.recentPRs} new PRs this week. On fire.`, pri: 9 },
  { id: "liftgain", test: c => c.topLiftGain >= 10, msg: c => `Your ${c.topLiftName} is up ${c.topLiftGain} lbs since you started.`, pri: 8 },
  { id: "protein", test: c => c.proteinHitStreak >= 3, msg: c => `Hit your protein target ${c.proteinHitStreak} days running.`, pri: 7 },
  { id: "calorie", test: c => c.calorieHitStreak >= 3, msg: c => `${c.calorieHitStreak} days inside your calorie target.`, pri: 6 },
  { id: "meals", test: c => c.loggedMealsToday >= 3, msg: c => `All meals logged today. Full picture.`, pri: 4 },
  { id: "neglect", test: c => c.neglectedZone, msg: c => `Your ${c.neglectedZone} has not been hit this week. Worth a look.`, pri: 6 },
  { id: "balanced", test: c => c.isBalanced, msg: c => `Every muscle group trained this week. Well balanced.`, pri: 7 },
  { id: "back", test: c => c.daysSinceLastWorkout >= 2 && c.daysSinceLastWorkout < 90, msg: c => `${c.daysSinceLastWorkout} days off. Today's a good day to lift.`, pri: 5 },
  { id: "welcome", test: c => c.totalWorkouts === 0, msg: c => `Log your first workout to start tracking progress.`, pri: 3 },
];
function activeCallouts(stats) {
  return CALLOUT_RULES.filter((r) => { try { return r.test(stats); } catch { return false; } }).map((r) => ({ id: r.id, text: r.msg(stats), pri: r.pri })).sort((a, b) => b.pri - a.pri);
}

// ============ DASHBOARD ============
function Dashboard({ profile, weights, workoutLogs, dayLog, plans, targets, totals, onGoTrain }) {
  const stats = computeStats({ profile, weights, workoutLogs, dayLog, plans, targets });
  const callouts = activeCallouts(stats);
  const hero = callouts[0];
  const highlights = callouts.slice(1, 6);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const activePlan = plans.find((p) => p.id === profile.activePlanId);

  // Calorie progress
  const calConsumed = Math.round(totals.calories);
  const calTarget = targets.calories;
  const calPct = Math.min(calConsumed / (calTarget || 1), 1);
  const calRemaining = calTarget - calConsumed;
  const isOver = calRemaining < 0;

  // Macro donut
  const pG = Math.round(totals.protein), cG = Math.round(totals.carbs), fG = Math.round(totals.fat);
  const pKcal = pG * 4, cKcal = cG * 4, fKcal = fG * 9;
  const totalMacroKcal = pKcal + cKcal + fKcal;
  const polar = (cx, cy, r, deg) => { const rad = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]; };
  const donutArc = (cx, cy, R, ri, a1, a2) => {
    if (a2 - a1 >= 360) a2 = a1 + 359.9;
    const [x1, y1] = polar(cx, cy, R, a1), [x2, y2] = polar(cx, cy, R, a2);
    const [x3, y3] = polar(cx, cy, ri, a2), [x4, y4] = polar(cx, cy, ri, a1);
    const lg = a2 - a1 > 180 ? 1 : 0;
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${lg} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${x3.toFixed(1)},${y3.toFixed(1)} A${ri},${ri} 0 ${lg} 0 ${x4.toFixed(1)},${y4.toFixed(1)} Z`;
  };
  const dcx = 60, dcy = 60, DR = 48, Dri = 32, Dgap = 3;
  const donutSegments = [];
  if (totalMacroKcal > 0) {
    const pDeg = (pKcal / totalMacroKcal) * 360, cDeg = (cKcal / totalMacroKcal) * 360, fDeg = (fKcal / totalMacroKcal) * 360;
    let a = 0;
    if (pDeg > Dgap * 2) donutSegments.push({ d: donutArc(dcx, dcy, DR, Dri, a + Dgap / 2, a + pDeg - Dgap / 2), color: COLORS.blue });
    a += pDeg;
    if (cDeg > Dgap * 2) donutSegments.push({ d: donutArc(dcx, dcy, DR, Dri, a + Dgap / 2, a + cDeg - Dgap / 2), color: COLORS.amber });
    a += cDeg;
    if (fDeg > Dgap * 2) donutSegments.push({ d: donutArc(dcx, dcy, DR, Dri, a + Dgap / 2, a + fDeg - Dgap / 2), color: COLORS.pink });
  }

  // Workout progress — 5/wk default matches any structured training plan
  const WORKOUT_TARGET = 5;
  const workoutsThisWeek = stats.workoutsThisWeek;

  // Weight trend
  const sortedW = [...(weights || [])].sort((a, b) => a.date.localeCompare(b.date));
  const recentW = sortedW.slice(-14);
  const wMin = recentW.length ? Math.min(...recentW.map(w => w.lbs)) : 0;
  const wMax = recentW.length ? Math.max(...recentW.map(w => w.lbs)) : 1;
  const wRange = Math.max(wMax - wMin, 1);

  return (
    <div style={styles.tabContent}>
      <div style={{ marginTop: 4 }}>
        <div style={styles.dimLabel}>{greeting},</div>
        <div style={styles.screenTitle}>{profile.name}</div>
      </div>

      {hero && (
        <div style={styles.heroCard}>
          <Trophy size={18} color={COLORS.bg} />
          <div style={styles.heroText}>{hero.text}</div>
        </div>
      )}

      {/* Calories progress */}
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={styles.cardHeader}>Calories</div>
          <div style={{ fontSize: 13, color: isOver ? COLORS.red : COLORS.textDim }}>
            {isOver ? `+${Math.abs(Math.round(calRemaining))} over` : `${Math.round(calRemaining)} left`}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
          <span style={{ fontFamily: FONT_NUM, fontSize: 32, fontWeight: 700, color: COLORS.text, lineHeight: 1 }}>{calConsumed.toLocaleString()}</span>
          <span style={{ color: COLORS.textDim, fontSize: 14 }}>of {calTarget.toLocaleString()} cal</span>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: COLORS.cardBorder, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.round(calPct * 100)}%`, background: isOver ? COLORS.red : COLORS.amber, borderRadius: 4 }} />
        </div>
      </div>

      {/* Macro donut + per-macro progress bars */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>Macros</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
          <svg viewBox="0 0 120 120" style={{ flex: "0 0 110px", width: 110, height: 110 }}>
            <circle cx={dcx} cy={dcy} r={(DR + Dri) / 2} fill="none" stroke={COLORS.cardBorder} strokeWidth={DR - Dri} />
            {donutSegments.map((seg, i) => <path key={i} d={seg.d} fill={seg.color} />)}
            <text x={dcx} y={dcy - 5} textAnchor="middle" fill={COLORS.text} fontSize="14" fontWeight="700" fontFamily={FONT_NUM}>
              {totalMacroKcal > 0 ? Math.round(totalMacroKcal) : "—"}
            </text>
            <text x={dcx} y={dcy + 10} textAnchor="middle" fill={COLORS.textDim} fontSize="10">
              {totalMacroKcal > 0 ? "kcal" : "no food"}
            </text>
          </svg>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { label: "Protein", g: pG, target: targets.protein, color: COLORS.blue },
              { label: "Carbs", g: cG, target: targets.carbs, color: COLORS.amber },
              { label: "Fat", g: fG, target: targets.fat, color: COLORS.pink },
            ].map(({ label, g, target, color }) => (
              <div key={label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: COLORS.textDim }}>{label}</span>
                  <span style={{ fontFamily: FONT_NUM, color: COLORS.text }}>{g}<span style={{ color: COLORS.textDim }}>/{target}g</span></span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: COLORS.cardBorder, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(g / (target || 1), 1) * 100}%`, background: color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workouts this week + Streak */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={styles.statTile}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
            <span style={{ fontFamily: FONT_NUM, fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{workoutsThisWeek}</span>
            <span style={{ fontSize: 12, color: COLORS.textDim }}>of {WORKOUT_TARGET}</span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>workouts this wk</div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: WORKOUT_TARGET }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < workoutsThisWeek ? COLORS.green : COLORS.cardBorder }} />
            ))}
          </div>
        </div>
        <div style={styles.statTile}>
          <div style={{ fontFamily: FONT_NUM, fontSize: 26, fontWeight: 600, lineHeight: 1, marginBottom: 2 }}>{stats.loggingStreak}</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 10 }}>day streak</div>
          <div style={{ fontSize: 11, color: stats.loggingStreak >= 3 ? COLORS.green : COLORS.textDim }}>
            {stats.loggingStreak >= 14 ? "outstanding" : stats.loggingStreak >= 7 ? "on a roll" : stats.loggingStreak >= 3 ? "building" : stats.loggingStreak > 0 ? "keep going" : "start today"}
          </div>
        </div>
      </div>

      {activePlan && (
        <button style={styles.nextWorkoutCard} onClick={onGoTrain}>
          <Dumbbell size={20} color={COLORS.amber} />
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={styles.nextWorkoutLabel}>Active plan</div>
            <div style={styles.nextWorkoutName}>{activePlan.name}</div>
          </div>
          <ChevronRight size={18} color={COLORS.textDim} />
        </button>
      )}

      {recentW.length > 1 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>Weight trend</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 60 }}>
            {recentW.map((w, i) => { const h = 15 + ((w.lbs - wMin) / wRange) * 75; return <div key={i} style={{ flex: 1, background: COLORS.amber, opacity: 0.5 + 0.5 * (i / recentW.length), borderRadius: 2, height: `${h}%`, minWidth: 2 }} />; })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={styles.dimLabel}>{recentW[0].lbs} lbs</span>
            <span style={styles.dimLabel}>{recentW[recentW.length - 1].lbs} lbs</span>
          </div>
        </div>
      )}

      {highlights.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>Highlights</div>
          {highlights.map((c) => (
            <div key={c.id} style={styles.calloutRow}>
              <div style={styles.calloutDot} />
              <span style={styles.calloutText}>{c.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ BODY HEATMAP ============
function heatColor(intensity) {
  // intensity 0..1 -> cool blue -> amber -> red
  if (intensity <= 0) return "#3D444D";
  const stops = [
    { t: 0.0, c: [91, 155, 213] },   // blue
    { t: 0.5, c: [232, 163, 61] },   // amber
    { t: 1.0, c: [229, 96, 79] },    // red
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) { if (intensity >= stops[i].t && intensity <= stops[i + 1].t) { lo = stops[i]; hi = stops[i + 1]; break; } }
  const span = (hi.t - lo.t) || 1; const f = (intensity - lo.t) / span;
  const rgb = lo.c.map((v, i) => Math.round(v + (hi.c[i] - v) * f));
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

const BODY_MEASUREMENTS = [
  "Left Arm", "Right Arm", "Shoulders", "Chest", "Waist", "Navel", "Hips",
  "Left Thigh", "Right Thigh", "Left Calf", "Right Calf", "Neck"
];

const MEASUREMENT_KINDS = {
  circumference: { label: "Circumference", unit: "in" },
  mass: { label: "Mass", unit: "lb" },
};

const MEASUREMENT_ANCHORS = {
  "Neck": { x: 50, y: 17, labelX: 72, labelY: 15 },
  "Shoulders": { x: 50, y: 26, labelX: 72, labelY: 25 },
  "Chest": { x: 50, y: 35, labelX: 72, labelY: 35 },
  "Left Arm": { x: 27, y: 38, labelX: 2, labelY: 36 },
  "Right Arm": { x: 73, y: 38, labelX: 98, labelY: 36 },
  "Waist": { x: 50, y: 50, labelX: 72, labelY: 49 },
  "Navel": { x: 50, y: 55, labelX: 72, labelY: 57 },
  "Hips": { x: 50, y: 62, labelX: 72, labelY: 66 },
  "Left Thigh": { x: 40, y: 73, labelX: 4, labelY: 72 },
  "Right Thigh": { x: 60, y: 73, labelX: 96, labelY: 72 },
  "Left Calf": { x: 42, y: 89, labelX: 5, labelY: 89 },
  "Right Calf": { x: 58, y: 89, labelX: 95, labelY: 89 },
};

function normalizeMeasurement(m) {
  const kind = m.kind || "circumference";
  return { ...m, kind, unit: m.unit || MEASUREMENT_KINDS[kind]?.unit || "in" };
}

function formatMeasurementValue(m) {
  const value = Number.isFinite(m.value) ? m.value.toFixed(1).replace(/\.0$/, "") : m.value;
  return m.kind === "mass" ? `${value} ${m.unit} mass` : `${value} ${m.unit}`;
}

function BodyTab({ workoutLogs, plans, profile, setProfiles, weights, addWeightEntry, saveGoalWeight, measurements, addMeasurementEntry }) {
  const [side, setSide] = useState("front");
  const [windowDays, setWindowDays] = useState(7);
  const [weightVal, setWeightVal] = useState("");
  const [goalInput, setGoalInput] = useState(profile.goalWeight ?? "");
  const [measurePart, setMeasurePart] = useState("Waist");
  const [measureKind, setMeasureKind] = useState("circumference");
  const [measureVal, setMeasureVal] = useState("");
  const gender = profile.gender || "male";
  const heat = computeHeatmap(workoutLogs, plans, windowDays);
  const max = Math.max(1, ...Object.values(heat));
  const norm = {}; Object.entries(heat).forEach(([z, v]) => norm[z] = v / max);
  const fill = (z) => heatColor(norm[z] || 0);
  const intensity = (z) => norm[z] || 0;
  const ranked = Object.entries(heat).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  function setGender(g) { setProfiles((prev) => prev.map((p) => p.id === profile.id ? { ...p, gender: g } : p)); }
  const sortedWeights = [...(weights || [])].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeight = sortedWeights[sortedWeights.length - 1], priorWeight = sortedWeights[sortedWeights.length - 2];
  const weightDelta = latestWeight && priorWeight ? latestWeight.lbs - priorWeight.lbs : null;
  const normalizedMeasurements = (measurements || []).map(normalizeMeasurement);
  const latestMetrics = BODY_MEASUREMENTS.flatMap((part) => Object.keys(MEASUREMENT_KINDS).map((kind) => {
    const rows = normalizedMeasurements.filter((m) => m.part === part && m.kind === kind).sort((a, b) => a.date.localeCompare(b.date));
    const latest = rows[rows.length - 1], prev = rows[rows.length - 2];
    return { part, kind, latest, prev, delta: latest && prev ? latest.value - prev.value : null };
  })).filter((m) => m.latest);
  const measureUnit = MEASUREMENT_KINDS[measureKind].unit;

  return (
    <div style={styles.tabContent}>
      <div style={styles.screenTitle}>Body</div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>Weight</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" step="0.1" placeholder="lbs" value={weightVal} onChange={(e) => setWeightVal(e.target.value)} style={{ ...styles.input, flex: 1 }} />
          <button style={styles.primaryButton} onClick={() => { if (!weightVal) return; addWeightEntry(Number(weightVal)); setWeightVal(""); }}>Log</button>
        </div>
        {latestWeight && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 12 }}>
            <div><div style={styles.bigNumber}>{latestWeight.lbs}<span style={{ fontSize: 16, color: COLORS.textDim }}> lbs</span></div><div style={styles.dimLabel}>as of {latestWeight.date}</div></div>
            {weightDelta !== null && <div style={{ ...styles.dimLabel, color: weightDelta > 0 ? COLORS.red : COLORS.blue }}>{weightDelta > 0 ? "+" : ""}{weightDelta.toFixed(1)} lbs</div>}
          </div>
        )}
      </div>
      <div style={styles.card}>
        <div style={styles.cardHeader}>Goal Weight</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="number" step="0.1" placeholder="goal lbs" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} style={{ ...styles.input, flex: 1 }} />
          <button style={styles.primaryButton} onClick={() => saveGoalWeight(goalInput === "" ? null : Number(goalInput))}>Set</button>
        </div>
        {profile.startWeight != null && profile.goalWeight != null && <div style={{ ...styles.dimLabel, marginTop: 8 }}>Start {profile.startWeight} to Goal {profile.goalWeight} lbs</div>}
      </div>
      {sortedWeights.length > 0 && <div style={styles.card}><div style={styles.cardHeader}>Weight Trend</div><WeightChart sorted={sortedWeights} goalWeight={profile.goalWeight} /></div>}

      <div style={styles.card}>
        <div style={styles.cardHeader}>Measurements</div>
        <div style={styles.measureInputGrid}>
          <select value={measurePart} onChange={(e) => setMeasurePart(e.target.value)} style={{ ...styles.input, gridColumn: "1 / -1" }}>
            {BODY_MEASUREMENTS.map((part) => <option key={part} value={part}>{part}</option>)}
          </select>
          <select value={measureKind} onChange={(e) => setMeasureKind(e.target.value)} style={styles.input}>
            {Object.entries(MEASUREMENT_KINDS).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
          </select>
          <input type="number" step="0.1" placeholder={measureUnit} value={measureVal} onChange={(e) => setMeasureVal(e.target.value)} style={styles.input} />
        </div>
        <button style={{ ...styles.primaryButton, width: "100%", marginTop: 10 }} onClick={() => { if (!measureVal) return; addMeasurementEntry({ date: todayKey(), part: measurePart, kind: measureKind, unit: measureUnit, value: Number(measureVal) }); setMeasureVal(""); }}>Log Measurement</button>
        <div style={styles.emptyHint}>{latestMetrics.length === 0 ? "No measurements logged yet." : "Latest measurements appear as callouts on the body map."}</div>
      </div>

      <div style={styles.screenTitle}>Muscle Heatmap</div>
      <div style={styles.segRow}>
        {[["front", "Front"], ["back", "Back"]].map(([v, l]) => (
          <button key={v} style={{ ...styles.segBtn, ...(side === v ? styles.segBtnOn : {}) }} onClick={() => setSide(v)}>{l}</button>
        ))}
      </div>
      <div style={styles.segRow}>
        {[[7, "7 days"], [30, "30 days"], [3650, "All time"]].map(([v, l]) => (
          <button key={v} style={{ ...styles.segBtn, ...(windowDays === v ? styles.segBtnOn : {}) }} onClick={() => setWindowDays(v)}>{l}</button>
        ))}
      </div>
      <div style={styles.segRow}>
        {[["male", "Male"], ["female", "Female"]].map(([v, l]) => (
          <button key={v} style={{ ...styles.segBtn, ...(gender === v ? styles.segBtnOn : {}) }} onClick={() => setGender(v)}>{l}</button>
        ))}
      </div>

      <div style={styles.bodyCard}>
        <div style={styles.bodyVisualWrap}>
          <AnatomyBody gender={gender} side={side} fill={fill} intensity={intensity} />
          <MeasurementCallouts metrics={latestMetrics} />
        </div>
        <div style={styles.legendRow}>
          <span style={styles.dimLabel}>less</span>
          <div style={styles.legendBar} />
          <span style={styles.dimLabel}>more</span>
        </div>
      </div>

      {latestMetrics.length > 0 && (
        <div style={styles.card}>
          <div style={styles.cardHeader}>Latest Measurements</div>
          {latestMetrics.map((m) => (
            <div key={`${m.part}-${m.kind}`} style={styles.measureRow}>
              <span>{m.part}</span>
              <span style={styles.tabularNum}>{formatMeasurementValue(m.latest)}</span>
              <span style={{ ...styles.dimLabel, color: m.delta == null ? COLORS.textDim : m.delta > 0 ? COLORS.amber : COLORS.blue }}>{m.delta == null ? "new" : `${m.delta > 0 ? "+" : ""}${m.delta.toFixed(1)}`}</span>
            </div>
          ))}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.cardHeader}>Sets by muscle · {windowDays === 3650 ? "all time" : `last ${windowDays} days`}</div>
        {ranked.length === 0 && <button style={styles.linkButton} onClick={onGoTrain}>Log a workout to build your heatmap</button>}
        {ranked.map(([z, v]) => (
          <div key={z} style={styles.zoneStatRow}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: heatColor((v / max)) }} />
            <span style={{ flex: 1, textTransform: "capitalize", fontSize: 14 }}>{z}</span>
            <span style={styles.tabularNum}>{Math.round(v)}</span>
          </div>
        ))}
      </div>
      <div style={styles.helpNote}>Intensity is working-set volume per muscle in the window. Blue is light, red is heavily worked. Untouched muscles stay dark.</div>
    </div>
  );
}

function MeasurementCallouts({ metrics }) {
  const groups = BODY_MEASUREMENTS.map((part) => ({
    part,
    anchor: MEASUREMENT_ANCHORS[part],
    metrics: metrics.filter((m) => m.part === part),
  })).filter((group) => group.anchor && group.metrics.length > 0);

  return (
    <div style={styles.measureCalloutLayer} aria-hidden="true">
      {groups.map(({ part, anchor, metrics: partMetrics }) => {
        const alignRight = anchor.labelX < anchor.x;
        const midX = (anchor.x + anchor.labelX) / 2;
        return (
          <div key={part}>
            <div style={{ ...styles.measureAnchorDot, left: `${anchor.x}%`, top: `${anchor.y}%` }} />
            <div
              style={{
                ...styles.measureConnector,
                left: `${Math.min(anchor.x, anchor.labelX)}%`,
                top: `${anchor.y}%`,
                width: `${Math.max(7, Math.abs(anchor.labelX - anchor.x))}%`,
              }}
            />
            <div style={{ ...styles.measureConnectorDot, left: `${midX}%`, top: `${anchor.y}%` }} />
            <div
              style={{
                ...styles.measureCallout,
                left: `${anchor.labelX}%`,
                top: `${anchor.labelY}%`,
                transform: alignRight ? "translate(-100%, -50%)" : "translate(0, -50%)",
                textAlign: alignRight ? "right" : "left",
              }}
            >
              <div style={styles.measureCalloutTitle}>{part}</div>
              {partMetrics.map((m) => <div key={m.kind} style={styles.measureCalloutValue}>{formatMeasurementValue(m.latest)}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Anatomical body from embedded MIT-licensed muscle paths (react-native-body-highlighter).
function AnatomyBody({ gender, side, fill, intensity }) {
  const key = `${gender}${side === "front" ? "Front" : "Back"}`;
  const paths = BODIES[key] || [];
  const vb = BODY_VB[key] || "0 0 724 1448";
  const zones = [...new Set(paths.filter((p) => p.z !== "base").map((p) => p.z))];
  return (
    <svg viewBox={vb} style={styles.bodySvg} preserveAspectRatio="xMidYMid meet">
      <defs>
        {zones.map((z) => {
          const iv = intensity ? intensity(z) : 0;
          if (iv <= 0) return null;
          const color = fill(z);
          return (
            <radialGradient key={z} id={`hg-${gender}-${side}-${z}`} cx="50%" cy="50%" r="65%" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="50%" stopColor={color} stopOpacity="0.65" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          );
        })}
      </defs>
      {paths.map((p, i) => {
        if (p.z === "base") return (
          <path key={i} d={p.d} fill="#2A2E33" stroke="#15171A" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        );
        const iv = intensity ? intensity(p.z) : 0;
        return (
          <path key={i} d={p.d}
            fill={iv > 0 ? `url(#hg-${gender}-${side}-${p.z})` : "#3D444D"}
            stroke="#15171A" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        );
      })}
    </svg>
  );
}

// ============ STYLE TOKENS ============
const COLORS = { bg: "#15171A", card: "#1E2125", cardBorder: "#2A2E33", text: "#F2F0EB", textDim: "#8A8F98", amber: "#E8A33D", blue: "#5B9BD5", pink: "#D87BA8", red: "#E5604F", green: "#5FB87A" };
const globalCss = `* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; } html { margin: 0; width: 100%; height: 100%; background: ${COLORS.bg}; overflow: hidden; overscroll-behavior: none; touch-action: pan-y; -webkit-text-size-adjust: 100%; } body { margin: 0; width: 100%; height: 100%; background: ${COLORS.bg}; overflow: hidden; overscroll-behavior: none; touch-action: pan-y; } #root { width: 100%; height: 100dvh; background: ${COLORS.bg}; overflow: hidden; } input, textarea, select { font-size: 16px; } input:focus, button:focus-visible, select:focus { outline: 2px solid ${COLORS.amber}; outline-offset: 1px; } input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; } @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }`;
const FONT_BODY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const FONT_NUM = "'SF Mono', 'Roboto Mono', ui-monospace, monospace";

const styles = {
  app: { height: "100dvh", background: COLORS.bg, color: COLORS.text, fontFamily: FONT_BODY, display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)", overflow: "hidden" },
  loadingScreen: { minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center" },
  loadingText: { color: COLORS.textDim, fontFamily: FONT_BODY },
  content: { flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", overscrollBehaviorY: "contain", touchAction: "pan-y", paddingBottom: "calc(76px + env(safe-area-inset-bottom))" },
  tabContent: { padding: "12px 14px 16px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 480, margin: "0 auto" },
  tabBar: { position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", background: COLORS.card, borderTop: `1px solid ${COLORS.cardBorder}`, padding: "8px 0 calc(14px + env(safe-area-inset-bottom))" },
  tabButton: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", background: "none", border: "none", cursor: "pointer", fontFamily: FONT_BODY },
  // top bar + profile chip
  topBar: { display: "flex", alignItems: "center", padding: "10px 14px 4px", maxWidth: 480, margin: "0 auto", width: "100%" },
  profileChip: { display: "flex", alignItems: "center", gap: 8, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 999, padding: "5px 12px 5px 6px", cursor: "pointer", fontFamily: FONT_BODY },
  chipAvatar: { width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.bg, fontWeight: 700, fontSize: 13 },
  chipName: { color: COLORS.text, fontSize: 14, fontWeight: 600 },
  // profile gate
  gateWrap: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, maxWidth: 480, margin: "0 auto", width: "100%" },
  gateTitle: { fontSize: 26, fontWeight: 700, marginBottom: 24, textAlign: "center" },
  gateGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  profileTile: { background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", fontFamily: FONT_BODY },
  profileTileAdd: { borderStyle: "dashed" },
  profileAvatar: { width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.bg, fontWeight: 700, fontSize: 24 },
  profileName: { fontSize: 15, fontWeight: 600, color: COLORS.text },
  gateInput: { width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "8px 10px", color: COLORS.text, fontSize: 14, fontFamily: FONT_BODY },
  smallPrimary: { flex: 1, background: COLORS.amber, color: COLORS.bg, border: "none", borderRadius: 7, padding: "7px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  smallSecondary: { background: "none", color: COLORS.textDim, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 7, padding: "7px 10px", fontSize: 13, cursor: "pointer" },
  // screens
  screenHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  screenTitle: { fontSize: 20, fontWeight: 700 },
  card: { background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 16 },
  cardHeader: { fontSize: 13, fontWeight: 600, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 },
  bigNumber: { fontFamily: FONT_NUM, fontSize: 34, fontWeight: 600, lineHeight: 1.1 },
  dimLabel: { fontSize: 12, color: COLORS.textDim },
  tabularNum: { fontFamily: FONT_NUM, fontSize: 16, fontWeight: 500 },
  stackedBarTrack: { display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "#2A2E33", margin: "14px 0" },
  stackedBarSeg: { height: "100%" },
  macroRow: { display: "flex", gap: 10 },
  linkButton: { background: "none", border: "none", color: COLORS.amber, fontSize: 13, padding: 0, marginTop: 6, cursor: "pointer", fontFamily: FONT_BODY, display: "inline-flex", alignItems: "center", gap: 4 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" },
  sectionTitle: { fontSize: 15, fontWeight: 600 },
  addCircleButton: { width: 26, height: 26, borderRadius: "50%", background: COLORS.amber, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  iconCircleButton: { width: 38, height: 38, borderRadius: "50%", background: COLORS.amber, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  iconButton: { background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", alignItems: "center" },
  foodRow: { display: "flex", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${COLORS.cardBorder}` },
  foodName: { fontSize: 14, fontWeight: 500 },
  foodMacros: { fontSize: 12, color: COLORS.textDim, marginTop: 2, fontFamily: FONT_NUM },
  emptyHint: { fontSize: 13, color: COLORS.textDim, padding: "8px 0", fontStyle: "italic" },
  helpNote: { fontSize: 12, color: COLORS.textDim, lineHeight: 1.5, padding: "4px 2px" },
  warningBanner: { background: "#2a1f0a", border: "1px solid #4a3a14", color: "#E8A33D", fontSize: 12, lineHeight: 1.4, padding: "10px 12px", borderRadius: 8, marginBottom: 10 },
  fieldRow: { marginBottom: 10 },
  fieldLabel: { fontSize: 12, color: COLORS.textDim, display: "block", marginBottom: 4 },
  input: { width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 15, fontFamily: FONT_BODY },
  miniInput: { width: "100%", minWidth: 0, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 7, padding: "8px 6px", color: COLORS.text, fontSize: 14, fontFamily: FONT_NUM, textAlign: "center" },
  miniLabel: { fontSize: 11, color: COLORS.textDim, marginBottom: 4, marginTop: 8, textTransform: "uppercase", letterSpacing: "0.03em" },
  primaryButton: { background: COLORS.amber, color: COLORS.bg, border: "none", borderRadius: 8, padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY },
  primaryButtonSm: { background: COLORS.amber, color: COLORS.bg, border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY, whiteSpace: "nowrap" },
  activeBadgeBtn: { background: "none", color: COLORS.amber, border: `1px solid ${COLORS.amber}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY, whiteSpace: "nowrap" },
  secondaryButton: { background: "none", color: COLORS.text, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "9px 14px", fontSize: 14, cursor: "pointer", fontFamily: FONT_BODY },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 50 },
  modalSheet: { background: COLORS.card, borderRadius: "16px 16px 0 0", padding: 18, width: "100%", maxWidth: 480, margin: "0 auto", maxHeight: "85vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: 600 },
  modeSwitch: { display: "flex", gap: 6, marginBottom: 14 },
  modeButton: { flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "8px 0", fontSize: 13, color: COLORS.textDim, cursor: "pointer", fontFamily: FONT_BODY },
  modeButtonActive: { color: COLORS.bg, background: COLORS.amber, borderColor: COLORS.amber },
  resultRow: { display: "flex", width: "100%", background: "none", border: "none", borderTop: `1px solid ${COLORS.cardBorder}`, padding: "10px 0", cursor: "pointer", textAlign: "left" },
  validHint: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, marginTop: 8, lineHeight: 1.4 },
  // plan library / builder
  planCard: { display: "flex", alignItems: "center", gap: 10, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 14 },
  planName: { fontSize: 15, fontWeight: 600 },
  planMeta: { fontSize: 12, color: COLORS.textDim, marginTop: 2 },
  exBuilderRow: { background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: 10, marginBottom: 8 },
  zonePicker: { display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 },
  zoneChip: { fontSize: 11, color: COLORS.textDim, background: "none", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 6, padding: "3px 7px", cursor: "pointer", fontFamily: FONT_BODY },
  zoneChipOn: { color: COLORS.bg, background: COLORS.blue, borderColor: COLORS.blue },
  // train run
  weekPicker: { display: "flex", alignItems: "center", justifyContent: "space-between", background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: "6px 8px" },
  weekLabel: { fontSize: 16, fontWeight: 600 },
  dayCard: { display: "flex", alignItems: "center", background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 14, cursor: "pointer", color: COLORS.text, fontFamily: FONT_BODY },
  dayCardTitle: { fontSize: 15, fontWeight: 600 },
  dayCardFocus: { fontSize: 13, color: COLORS.textDim, marginTop: 2 },
  badge: { fontSize: 11, fontWeight: 600, borderRadius: 6, padding: "2px 7px" },
  exCard: { display: "flex", alignItems: "center", background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 14, cursor: "pointer", color: COLORS.text, fontFamily: FONT_BODY },
  exCardName: { fontSize: 15, fontWeight: 600 },
  exCardMeta: { fontSize: 13, color: COLORS.textDim, marginTop: 2, fontFamily: FONT_NUM },
  exLastLine: { fontSize: 12, color: COLORS.blue, marginTop: 4, fontFamily: FONT_NUM },
  backRow: { display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: COLORS.amber, fontSize: 14, cursor: "pointer", padding: 0, fontFamily: FONT_BODY },
  exTitle: { fontSize: 19, fontWeight: 700 },
  exPrescription: { fontSize: 14, marginTop: 4, fontFamily: FONT_NUM },
  exNote: { fontSize: 13, color: COLORS.textDim, marginTop: 8, lineHeight: 1.4, fontStyle: "italic" },
  refRow: { display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" },
  refChip: { display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: COLORS.blue, border: `1px solid ${COLORS.blue}`, borderRadius: 6, padding: "4px 8px", fontFamily: FONT_NUM },
  setHeaderRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  setCol: { flex: 1, fontSize: 12 },
  setRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
  setInput: { flex: 1, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "10px 12px", color: COLORS.text, fontSize: 16, fontFamily: FONT_NUM, textAlign: "center", width: "100%" },
  noteInput: { width: "100%", background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "8px 12px", color: COLORS.text, fontSize: 13, fontFamily: FONT_BODY, marginBottom: 8 },
  histRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${COLORS.cardBorder}` },
  guidedCard: { background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 },
  guidedSetBox: { background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: 12 },
  restPanel: { background: "#211c13", border: `1px solid ${COLORS.amber}`, borderRadius: 10, padding: 12 },
  timerText: { fontFamily: FONT_NUM, fontSize: 38, fontWeight: 700, color: COLORS.amber, textAlign: "center", marginBottom: 10 },
  servingStepper: { display: "grid", gridTemplateColumns: "44px 1fr 44px", gap: 8, alignItems: "center" },
  stepButton: { height: 44, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  servingValue: { width: "100%", height: 44, background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, color: COLORS.text, fontSize: 22, fontFamily: FONT_NUM, textAlign: "center" },
  quickServingRow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5, marginTop: 8 },
  quickServingBtn: { background: COLORS.bg, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 7, color: COLORS.textDim, fontSize: 12, padding: "7px 0", cursor: "pointer", fontFamily: FONT_NUM },
  quickServingBtnOn: { background: COLORS.amber, borderColor: COLORS.amber, color: COLORS.bg, fontWeight: 700 },
  // dashboard
  heroCard: { display: "flex", alignItems: "center", gap: 10, background: COLORS.amber, borderRadius: 14, padding: "14px 16px" },
  heroText: { color: COLORS.bg, fontWeight: 600, fontSize: 15, lineHeight: 1.3 },
  dashGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  statTile: { background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 14 },
  statBig: { fontFamily: FONT_NUM, fontSize: 26, fontWeight: 600, lineHeight: 1 },
  statLabel: { fontSize: 12, color: COLORS.textDim, marginTop: 4 },
  historyGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  nutritionDayRow: { display: "flex", alignItems: "center", gap: 8, padding: "5px 0" },
  historyBarTrack: { flex: 1, height: 7, borderRadius: 4, background: COLORS.cardBorder, overflow: "hidden" },
  historyBarFill: { height: "100%", borderRadius: 4 },
  nextWorkoutCard: { display: "flex", alignItems: "center", gap: 12, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 14, cursor: "pointer", fontFamily: FONT_BODY, width: "100%" },
  nextWorkoutLabel: { fontSize: 12, color: COLORS.textDim },
  nextWorkoutName: { fontSize: 15, fontWeight: 600, color: COLORS.text, marginTop: 2 },
  calloutRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${COLORS.cardBorder}` },
  calloutDot: { width: 6, height: 6, borderRadius: "50%", background: COLORS.amber, flexShrink: 0 },
  calloutText: { fontSize: 14, lineHeight: 1.35 },
  // body heatmap
  segRow: { display: "flex", gap: 6 },
  segBtn: { flex: 1, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 8, padding: "8px 0", fontSize: 13, color: COLORS.textDim, cursor: "pointer", fontFamily: FONT_BODY },
  segBtnOn: { color: COLORS.bg, background: COLORS.amber, borderColor: COLORS.amber, fontWeight: 600 },
  bodyCard: { background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" },
  bodyVisualWrap: { position: "relative", width: "100%", maxWidth: 440, display: "flex", justifyContent: "center" },
  bodySvg: { width: "100%", maxWidth: 260, height: "auto", maxHeight: 440 },
  measureCalloutLayer: { position: "absolute", inset: 0, pointerEvents: "none" },
  measureAnchorDot: { position: "absolute", width: 7, height: 7, marginLeft: -3.5, marginTop: -3.5, borderRadius: "50%", background: COLORS.amber, boxShadow: `0 0 0 3px ${COLORS.amberSoft}` },
  measureConnector: { position: "absolute", height: 1, background: COLORS.amberSoft, transform: "translateY(-0.5px)" },
  measureConnectorDot: { position: "absolute", width: 3, height: 3, marginLeft: -1.5, marginTop: -1.5, borderRadius: "50%", background: COLORS.amberSoft },
  measureCallout: { position: "absolute", minWidth: 74, maxWidth: 118, padding: "5px 7px", borderRadius: 8, background: "rgba(19, 21, 26, 0.88)", border: `1px solid ${COLORS.cardBorder}`, boxShadow: "0 8px 18px rgba(0,0,0,0.22)" },
  measureCalloutTitle: { fontSize: 10, lineHeight: 1.15, color: COLORS.textDim, fontWeight: 600 },
  measureCalloutValue: { fontSize: 12, lineHeight: 1.2, color: COLORS.text, fontFamily: FONT_NUM },
  legendRow: { display: "flex", alignItems: "center", gap: 8, marginTop: 8 },
  legendBar: { width: 120, height: 8, borderRadius: 4, background: "linear-gradient(90deg, #5B9BD5, #E8A33D, #E5604F)" },
  zoneStatRow: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${COLORS.cardBorder}` },
  measureInputGrid: { display: "grid", gridTemplateColumns: "1fr 92px", gap: 8 },
  measureRow: { display: "grid", gridTemplateColumns: "1fr auto 44px", gap: 8, alignItems: "center", padding: "8px 0", borderTop: `1px solid ${COLORS.cardBorder}`, fontSize: 14 },
};
