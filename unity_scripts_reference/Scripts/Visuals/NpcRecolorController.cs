using UnityEngine;

namespace CuuThienTruyenKy.Visuals
{
    public enum NpcSectPalette { NgocThanh, HuyetMa, KimTien, UMinh }

    [RequireComponent(typeof(SpriteRenderer))]
    public class NpcRecolorController : MonoBehaviour
    {
        public NpcSectPalette sectPalette = NpcSectPalette.NgocThanh;
        private MaterialPropertyBlock _mpb;
        private SpriteRenderer _renderer;
        private static readonly int HueShiftId = Shader.PropertyToID("_HueShift");
        private static readonly int SatId = Shader.PropertyToID("_Saturation");
        private static readonly int ColorId = Shader.PropertyToID("_Color");

        private void Awake()
        {
            _renderer = GetComponent<SpriteRenderer>();
            _mpb = new MaterialPropertyBlock();
            ApplyPalette(sectPalette);
        }

        public void ApplyPalette(NpcSectPalette palette)
        {
            sectPalette = palette;
            _renderer.GetPropertyBlock(_mpb);
            switch (palette)
            {
                case NpcSectPalette.NgocThanh:
                    _mpb.SetFloat(HueShiftId, 0.45f); _mpb.SetFloat(SatId, 1.15f); _mpb.SetColor(ColorId, new Color(0.85f, 1f, 0.96f, 1f)); break;
                case NpcSectPalette.HuyetMa:
                    _mpb.SetFloat(HueShiftId, 0.92f); _mpb.SetFloat(SatId, 1.35f); _mpb.SetColor(ColorId, new Color(1f, 0.78f, 0.78f, 1f)); break;
                case NpcSectPalette.KimTien:
                    _mpb.SetFloat(HueShiftId, 0.14f); _mpb.SetFloat(SatId, 1.25f); _mpb.SetColor(ColorId, new Color(1f, 0.95f, 0.75f, 1f)); break;
                case NpcSectPalette.UMinh:
                    _mpb.SetFloat(HueShiftId, 0.72f); _mpb.SetFloat(SatId, 1.2f); _mpb.SetColor(ColorId, new Color(0.85f, 0.85f, 1f, 1f)); break;
            }
            _renderer.SetPropertyBlock(_mpb);
        }
    }
}
