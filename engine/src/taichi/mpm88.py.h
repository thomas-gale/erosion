#include <stdio.h>
#include <stdlib.h>
#include <math.h>

typedef char Ti_i8; typedef short Ti_i16; typedef int Ti_i32; typedef long long Ti_i64; typedef unsigned char Ti_u8; typedef unsigned short Ti_u16; typedef unsigned int Ti_u32; typedef unsigned long long Ti_u64; typedef float Ti_f32; typedef double Ti_f64;
static inline Ti_i32 Ti_max(Ti_i32 x, Ti_i32 y) { return x > y ? x : y; } static inline Ti_i32 Ti_min(Ti_i32 x, Ti_i32 y) { return x < y ? x : y; } static inline Ti_i64 Ti_llmax(Ti_i64 x, Ti_i64 y) { return x > y ? x : y; } static inline Ti_i64 Ti_llmin(Ti_i64 x, Ti_i64 y) { return x < y ? x : y; } static inline Ti_i64 Ti_llsgn(Ti_i64 x) { return x < 0 ? -1 : x != 0; } static inline Ti_i32 Ti_sgn(Ti_i32 x) { return x < 0 ? -1 : x != 0; } static inline Ti_f32 Ti_fsgnf(Ti_f32 x) { return x < 0 ? -1 : x != 0; } static inline Ti_f64 Ti_fsgn(Ti_f64 x) { return x < 0 ? -1 : x != 0; } static inline Ti_i64 Ti_floordiv_i64(Ti_i64 x, Ti_i64 y) { Ti_i64 r = x / y; return r - ((x < 0) != (y < 0) && x && y * r != x); } static inline Ti_i32 Ti_floordiv_i32(Ti_i32 x, Ti_i32 y) { Ti_i32 r = x / y; return r - ((x < 0) != (y < 0) && x && y * r != x); } static inline Ti_f32 Ti_floordiv_f32(Ti_f32 x, Ti_f32 y) { return floorf(x / y); } static inline Ti_f64 Ti_floordiv_f64(Ti_f64 x, Ti_f64 y) { return floor(x / y); } static inline Ti_f32 Ti_rsqrtf(Ti_f32 x) { return 1 / sqrt(x); } static inline Ti_f64 Ti_rsqrt(Ti_f64 x) { return 1 / sqrt(x); }
static inline Ti_i32 Ti_rand_i32(void) { return mrand48(); } static inline Ti_i64 Ti_rand_i64(void) { return ((Ti_i64) mrand48() << 32) | mrand48(); } static inline Ti_f64 Ti_rand_f64(void) { return drand48(); } static inline Ti_f32 Ti_rand_f32(void) { return (Ti_f32) drand48(); } typedef Ti_u8 *Ti_AdStackPtr; static inline Ti_u32 *Ti_ad_stack_n(Ti_AdStackPtr stack) { return (Ti_u32 *)stack; } static inline Ti_AdStackPtr Ti_ad_stack_data(Ti_AdStackPtr stack) { return stack + sizeof(Ti_u32); } static inline void Ti_ad_stack_init(Ti_AdStackPtr stack) { Ti_u32 *n = Ti_ad_stack_n(stack); Ti_i32 *data = (Ti_i32 *)Ti_ad_stack_data(stack); *n = 0; } static inline Ti_AdStackPtr Ti_ad_stack_top_primal(Ti_AdStackPtr stack, Ti_u32 element_size) { Ti_u32 *n = Ti_ad_stack_n(stack); return Ti_ad_stack_data(stack) + (*n - 1) * 2 * element_size; } static inline Ti_AdStackPtr Ti_ad_stack_top_adjoint(Ti_AdStackPtr stack, Ti_u32 element_size) { return Ti_ad_stack_top_primal(stack, element_size) + element_size; } static inline void Ti_ad_stack_pop(Ti_AdStackPtr stack) { Ti_u32 *n = Ti_ad_stack_n(stack); --(*n); } static inline void Ti_ad_stack_push(Ti_AdStackPtr stack, Ti_u32 element_size) { Ti_u32 i; Ti_u32 *n = Ti_ad_stack_n(stack); ++(*n); Ti_AdStackPtr data = Ti_ad_stack_top_primal(stack, element_size); for (i = 0; i < element_size * 2; ++i) { data[i] = 0; } }
union Ti_BitCast { Ti_i64 val_i64; Ti_i32 val_i32; Ti_i16 val_i16; Ti_i8 val_i8; Ti_u64 val_u64; Ti_u32 val_u32; Ti_u16 val_u16; Ti_u8 val_u8; Ti_f32 val_f32; Ti_f64 val_f64; Ti_i64 *ptr_i64; Ti_i32 *ptr_i32; Ti_i16 *ptr_i16; Ti_i8 *ptr_i8; Ti_u64 *ptr_u64; Ti_u32 *ptr_u32; Ti_u16 *ptr_u16; Ti_u8 *ptr_u8; Ti_f32 *ptr_f32; Ti_f64 *ptr_f64; void *ptr_void; }; struct Ti_Context { struct Ti_S0root *root; Ti_i8 *gtmp; union Ti_BitCast *args; int *earg; };

struct Ti_S0root {
  struct Ti_S1dense {
    Ti_f32 S2;
    Ti_f32 S3;
  } S1[2048];
  struct Ti_S4dense {
    Ti_f32 S5;
    Ti_f32 S6;
  } S4[2048];
  struct Ti_S7dense {
    Ti_f32 S8;
    Ti_f32 S9;
    Ti_f32 S10;
    Ti_f32 S11;
  } S7[2048];
  struct Ti_S12dense {
    Ti_f32 S13;
  } S12[2048];
  struct Ti_S14dense {
    Ti_f32 S15;
    Ti_f32 S16;
  } S14[4096];
  struct Ti_S17dense {
    Ti_f32 S18;
  } S17[4096];
};

extern struct Ti_Context Ti_ctx;

extern void Tk_substep_c4_0(struct Ti_Context *ti_ctx);
extern void Tk_reset_c6_0(struct Ti_Context *ti_ctx);
extern void Tk_hub_get_substep_nr_c8_0(struct Ti_Context *ti_ctx);
extern void Tk_hub_get_num_particles_c10_0(struct Ti_Context *ti_ctx);
extern void Tk_hub_get_particles_c12_0(struct Ti_Context *ti_ctx);
