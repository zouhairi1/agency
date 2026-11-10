uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;

varying vec3 vNormal;
varying float vDisplacement;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.2);
  float d = smoothstep(-0.25, 0.35, vDisplacement);
  vec3 color = mix(uColorA, uColorB, d);
  color = mix(color, uAccent, fresnel * 0.55);
  gl_FragColor = vec4(color, 1.0);
}
