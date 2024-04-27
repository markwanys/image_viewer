const eye = n => [...Array(n)].map((e, i, a) => a.map(e => +!i--));

//matrixB • matrixA
export function reset_transform(img_obj):
  img_obj.mat_affine = eye(3)
  