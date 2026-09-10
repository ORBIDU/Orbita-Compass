import svgPaths from "./svg-1ocebcpesf";
import imgImage from "./08aebdb1dfd2899058b70cb3bc161ecebeaca9b5.png";

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[0.8px] relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] bg-clip-text bg-gradient-to-r flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold from-[#0965fa] justify-center leading-[0] relative shrink-0 text-[48px] text-[transparent] text-center to-[#00b2dd] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[52.8px]">Setiap Mimpi Punya Orbitnya.</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[672px] relative shrink-0 w-[672px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#696969] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28.8px] mb-0">Kami percaya bahwa masa depan bukanlah garis lurus, melainkan sebuah</p>
        <p className="leading-[28.8px] mb-0">konstelasi potensi. ORBITA hadir sebagai sistem navigasi untuk membantumu</p>
        <p className="leading-[28.8px] mb-0">memetakan jalur, menemukan passion, dan merancang trayektori pendidikan</p>
        <p className="leading-[28.8px]">yang tepat menuju masa depan yang cemerlang.</p>
      </div>
    </div>
  );
}

function Section1Hero() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Section 1: Hero">
      <div className="flex flex-col items-center max-w-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[22.7px] items-center max-w-[inherit] px-[64px] relative size-full">
          <Heading />
          <Container />
        </div>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0085ff] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[31.2px]">Mengapa ORBITA?</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-center max-w-[576px] pb-[0.685px] relative shrink-0 w-[576px]" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#696969] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[25.6px] mb-0">Seperti benda langit yang memiliki gravitasinya sendiri, setiap individu</p>
        <p className="leading-[25.6px] mb-0">(Programmer, Dokter, Desainer) membutuhkan jalur orbit yang unik untuk</p>
        <p className="leading-[25.6px]">bersinar terang.</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[15.095px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Container2 />
    </div>
  );
}

function SvgConnectingLine() {
  return (
    <div className="-translate-y-1/2 absolute h-[96px] left-0 overflow-clip right-0 top-1/2" data-name="SVG Connecting Line">
      <div className="absolute inset-[30%_5%]" data-name="Vector">
        <div className="absolute inset-[-2.75%_0]">
          <svg className="block size-full" fill="none" height="40.5103" preserveAspectRatio="none" viewBox="0 0 1037.15 40.5103" width="1037.15">
            <path d={svgPaths.p4a32840} id="Vector" stroke="black" strokeDasharray="8.45 8.45" strokeOpacity="0.2" strokeWidth="2.112" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="16" preserveAspectRatio="none" viewBox="0 0 16 16" width="16">
        <g id="Container">
          <path d={svgPaths.p85bff00} fill="#898CA6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadowOverlayBlur() {
  return (
    <div className="backdrop-blur-[6px] bg-white content-stretch drop-shadow-[0px_0px_10px_rgba(193,196,230,0.1)] flex items-center justify-center p-[4px] relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background+Border+Shadow+OverlayBlur">
      <div aria-hidden className="absolute border-4 border-[rgba(137,140,166,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container4 />
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col h-[80px] items-start pb-[16px] relative shrink-0 w-[64px]" data-name="Margin">
      <BackgroundBorderShadowOverlayBlur />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#898ca6] text-[12px] tracking-[1.2px] whitespace-nowrap">
        <p className="leading-[12px]">Diri</p>
      </div>
    </div>
  );
}

function Node() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[48px] relative shrink-0 w-[178.66px]" data-name="Node 1">
      <Margin />
      <Container5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[18.35px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18.35" preserveAspectRatio="none" viewBox="0 0 20 18.35" width="20">
        <g id="Container">
          <path d={svgPaths.p279a9400} fill="#00ABD1" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadowOverlayBlur1() {
  return (
    <div className="backdrop-blur-[6px] bg-white content-stretch drop-shadow-[0px_0px_10px_rgba(76,215,246,0.1)] flex items-center justify-center p-[4px] relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background+Border+Shadow+OverlayBlur">
      <div aria-hidden className="absolute border-4 border-[rgba(76,215,246,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container6 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="content-stretch flex flex-col h-[80px] items-start pb-[16px] relative shrink-0 w-[64px]" data-name="Margin">
      <BackgroundBorderShadowOverlayBlur1 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00abd1] text-[12px] tracking-[1.2px] whitespace-nowrap">
        <p className="leading-[12px]">Minat</p>
      </div>
    </div>
  );
}

function Node1() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[16px] relative shrink-0 w-full" data-name="Node 2">
      <Margin1 />
      <Container7 />
    </div>
  );
}

function Node2Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-[178.67px]" data-name="Node 2:margin">
      <Node1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 16 20" width="16">
        <g id="Container">
          <path d={svgPaths.p12df5c00} fill="#898CA6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadowOverlayBlur2() {
  return (
    <div className="backdrop-blur-[6px] bg-white content-stretch drop-shadow-[0px_0px_10px_rgba(195,192,255,0.1)] flex items-center justify-center p-[4px] relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background+Border+Shadow+OverlayBlur">
      <div aria-hidden className="absolute border-4 border-[rgba(137,140,166,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container8 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col h-[80px] items-start pb-[16px] relative shrink-0 w-[64px]" data-name="Margin">
      <BackgroundBorderShadowOverlayBlur2 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#898ca6] text-[12px] tracking-[1.2px] whitespace-nowrap">
        <p className="leading-[12px]">Potensi</p>
      </div>
    </div>
  );
}

function Node2() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 pb-[64px] right-0 top-[-16px]" data-name="Node 3">
      <Margin2 />
      <Container9 />
    </div>
  );
}

function Node3Margin() {
  return (
    <div className="h-[140px] relative shrink-0 w-[178.67px]" data-name="Node 3:margin">
      <Node2 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[18px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="18" preserveAspectRatio="none" viewBox="0 0 22 18" width="22">
        <g id="Container">
          <path d={svgPaths.pb257040} fill="#898CA6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadowOverlayBlur3() {
  return (
    <div className="backdrop-blur-[6px] bg-white content-stretch drop-shadow-[0px_0px_10px_rgba(193,196,230,0.1)] flex items-center justify-center p-[4px] relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background+Border+Shadow+OverlayBlur">
      <div aria-hidden className="absolute border-4 border-[rgba(137,140,166,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container10 />
    </div>
  );
}

function Margin3() {
  return (
    <div className="content-stretch flex flex-col h-[80px] items-start pb-[16px] relative shrink-0 w-[64px]" data-name="Margin">
      <BackgroundBorderShadowOverlayBlur3 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#898ca6] text-[12px] tracking-[1.2px] whitespace-nowrap">
        <p className="leading-[12px]">Jurusan</p>
      </div>
    </div>
  );
}

function Node3() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[32px] relative shrink-0 w-full" data-name="Node 4">
      <Margin3 />
      <Container11 />
    </div>
  );
}

function Node4Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[178.66px]" data-name="Node 4:margin">
      <Node3 />
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20" preserveAspectRatio="none" viewBox="0 0 20 20" width="20">
        <g id="Container">
          <path d={svgPaths.p5df7b00} fill="#00ABD1" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundBorderShadowOverlayBlur4() {
  return (
    <div className="backdrop-blur-[6px] bg-white content-stretch drop-shadow-[0px_0px_10px_rgba(76,215,246,0.1)] flex items-center justify-center p-[4px] relative rounded-[9999px] shrink-0 size-[64px]" data-name="Background+Border+Shadow+OverlayBlur">
      <div aria-hidden className="absolute border-4 border-[rgba(76,215,246,0.3)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Container12 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="content-stretch flex flex-col h-[80px] items-start pb-[16px] relative shrink-0 w-[64px]" data-name="Margin">
      <BackgroundBorderShadowOverlayBlur4 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00abd1] text-[12px] tracking-[1.2px] w-[120px]">
        <p className="leading-[12px]">Perguruan Tinggi</p>
      </div>
    </div>
  );
}

function Node4() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Node 5">
      <Margin4 />
      <Container13 />
    </div>
  );
}

function Node5Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[48px] relative shrink-0 w-[178.67px]" data-name="Node 5:margin">
      <Node4 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[20.071px] relative shrink-0 w-[20.047px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.0706" preserveAspectRatio="none" viewBox="0 0 20.0467 20.0706" width="20.0467">
        <g id="Container">
          <path d={svgPaths.p6551200} fill="white" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="content-stretch drop-shadow-[0px_0px_15px_rgba(76,215,246,0.4)] flex items-center justify-center relative rounded-[9999px] shrink-0 size-[80px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(76, 215, 246) 0%, rgb(195, 192, 255) 100%)" }} data-name="Background+Shadow">
      <Container14 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="content-stretch flex flex-col h-[96px] items-start pb-[16px] relative shrink-0 w-[80px]" data-name="Margin">
      <BackgroundShadow />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e0e3e5] text-[12px] tracking-[1.2px] whitespace-nowrap">
        <p className="leading-[12px]">Masa Depan</p>
      </div>
    </div>
  );
}

function Node5() {
  return (
    <div className="absolute content-stretch flex flex-col items-center left-0 pb-[64px] right-0 top-[-32px]" data-name="Node 6">
      <Margin5 />
      <Container15 />
    </div>
  );
}

function Node6Margin() {
  return (
    <div className="h-[140px] relative shrink-0 w-[178.67px]" data-name="Node 6:margin">
      <Node5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Node />
      <Node2Margin />
      <Node3Margin />
      <Node4Margin />
      <Node5Margin />
      <Node6Margin />
    </div>
  );
}

function PathVisualization() {
  return (
    <div className="content-stretch flex flex-col items-start py-[64px] relative shrink-0 w-full" data-name="Path Visualization">
      <SvgConnectingLine />
      <Container3 />
    </div>
  );
}

function Section2Philosophy() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Section 2: Philosophy">
      <div className="content-stretch flex flex-col gap-[64px] items-start max-w-[inherit] px-[64px] relative size-full">
        <Container1 />
        <PathVisualization />
      </div>
    </div>
  );
}

function Border() {
  return (
    <div className="flex-[1_0_0] h-[320px] min-w-px relative rounded-[24px]" data-name="Border">
      <div className="content-stretch flex flex-col items-start justify-center overflow-clip p-px relative rounded-[inherit] size-full">
        <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Image">
          <div className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-3.83%] max-w-none top-0 w-[107.67%]" src={imgImage} />
          </div>
        </div>
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] bg-clip-text bg-gradient-to-r flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold from-[#15234d] justify-center leading-[0] relative shrink-0 text-[24px] text-[transparent] to-[#101a33] w-full">
        <p className="leading-[30px] mb-0">Karena Menentukan Masa Depan Tidak</p>
        <p className="leading-[30px]">Seharusnya Membingungkan.</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3d3d3d] text-[16px] w-full">
        <p className="leading-[25.6px] mb-0">{`Menjembatani pertanyaan "Siapa saya?" dengan tindakan "Apa yang`}</p>
        <p className="leading-[25.6px] mb-0">{`harus saya lakukan hari ini?". Kami mengubah kecemasan menjadi`}</p>
        <p className="leading-[25.6px] mb-0">rencana yang jelas, memecah perjalanan panjang menjadi langkah-</p>
        <p className="leading-[25.6px]">langkah orbital yang terukur.</p>
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[20px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 20 24" width="20">
        <g id="Margin">
          <path d={svgPaths.p3c38b80} fill="#4CD7F6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Item">
      <Margin6 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[36.02px] not-italic text-[#666] text-[16px] top-[12px] whitespace-nowrap">
        <p className="leading-[25.6px]">Analisis Potensi Berbasis Data</p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="absolute h-[24px] left-0 top-0 w-[20px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" height="24" preserveAspectRatio="none" viewBox="0 0 20 24" width="20">
        <g id="Margin">
          <path d={svgPaths.p3c38b80} fill="#4CD7F6" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Item1() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Item">
      <Margin7 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] left-[36.02px] not-italic text-[#666] text-[16px] top-[12px] whitespace-nowrap">
        <p className="leading-[25.6px]">Pemetaan Jurusan Presisi</p>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pt-[1.09px] relative shrink-0 w-full" data-name="List">
      <Item />
      <Item1 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[22.9px] items-start min-w-px relative" data-name="Container">
      <Heading2 />
      <Container17 />
      <List />
    </div>
  );
}

function Section3Purpose() {
  return (
    <div className="content-stretch flex gap-[64px] items-center justify-center pt-px relative shrink-0 w-[1152px]" data-name="Section 3: Purpose">
      <Border />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="max-w-[768px] relative shrink-0 w-[768px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center max-w-[inherit] pb-[0.59px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">
          <p className="leading-[28.8px] mb-0">Misi kami adalah memastikan setiap siswa memiliki persiapan yang jelas, terstruktur, dan</p>
          <p className="leading-[28.8px] mb-0">didukung oleh ekosistem yang tepat. Menghilangkan ruang untuk keraguan,</p>
          <p className="leading-[28.8px]">memaksimalkan ruang untuk pencapaian.</p>
        </div>
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 2">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center pb-[0.69px] relative size-full">
        <div className="[word-break:break-word] bg-clip-text bg-gradient-to-r flex flex-col font-['Plus_Jakarta_Sans:ExtraBold',sans-serif] font-extrabold from-[#15234d] justify-center leading-[0] relative shrink-0 text-[48px] text-[transparent] text-center to-[#101a33] tracking-[-0.96px] whitespace-nowrap">
          <p className="leading-[52.8px] mb-0">Temukan Orbitmu,</p>
          <p className="leading-[52.8px]">Raih Mimpimu.</p>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-gradient-to-r drop-shadow-[0px_0px_10px_rgba(193,196,230,0.2)] from-[#ff7000] relative rounded-[9999px] shrink-0 to-[#f1ad00]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[16px] pt-[17.11px] px-[32px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white tracking-[1.2px] whitespace-nowrap">
          <p className="leading-[12px]">Mulai Eksplorasi</p>
        </div>
      </div>
    </div>
  );
}

function Section45VisionSlogan() {
  return (
    <div className="backdrop-blur-[12px] bg-gradient-to-r from-[#0965fa] relative rounded-[32px] shrink-0 to-[#00b2dd] w-[1152px]" data-name="Section 4 & 5: Vision & Slogan">
      <div className="content-stretch flex flex-col gap-[46.9px] items-center overflow-clip pb-[96.99px] pt-[96.8px] px-[97px] relative rounded-[inherit] size-full">
        <div className="absolute bg-gradient-to-b from-[rgba(193,196,230,0.1)] inset-[2px_1px_1px_1px] to-[rgba(193,196,230,0)]" data-name="Inner Glow" />
        <Container18 />
        <Heading3 />
        <Button />
      </div>
      <div aria-hidden className="absolute border border-[rgba(255,255,255,0.05)] border-solid inset-0 pointer-events-none rounded-[32px]" />
    </div>
  );
}

function LogoMascot() {
  return (
    <div className="absolute inset-[0_62.87%_0_0]" data-name="LogoMascot">
      <svg className="absolute block inset-0 size-full" fill="none" height="70.1817" preserveAspectRatio="none" viewBox="0 0 70.1817 70.1817" width="70.1817">
        <g filter="url(#filter0_d_0_19)" id="LogoMascot">
          <path d={svgPaths.p3ff81700} id="Vector" opacity="0.6" stroke="url(#paint0_linear_0_19)" strokeWidth="2.3714" />
          <path d={svgPaths.p35f7aa00} fill="url(#paint1_linear_0_19)" id="Vector_2" />
          <path d={svgPaths.p1f6ccfaa} id="Vector_3" stroke="url(#paint2_linear_0_19)" strokeWidth="2.3714" />
          <path d={svgPaths.p72f5f0} fill="white" id="Vector_4" opacity="0.3" />
          <g id="Group">
            <path d={svgPaths.p2307e4e0} fill="#1E293B" id="Vector_5" />
            <path d={svgPaths.p5887d30} fill="#334155" id="Vector_6" />
            <g id="Vector_7">
              <path d={svgPaths.p2cb47800} fill="black" />
              <path d={svgPaths.p23c03600} stroke="#F59E0B" strokeWidth="0.701817" />
            </g>
            <path d={svgPaths.p221ce900} fill="#F59E0B" id="Vector_8" />
            <path d={svgPaths.p24c72a80} fill="#FBBF24" id="Vector_9" />
          </g>
          <path d={svgPaths.p2ad72600} fill="black" id="Vector_10" />
          <path d={svgPaths.p2ec7f700} fill="white" id="Vector_11" />
          <path d={svgPaths.p3cff5c80} fill="white" id="Vector_12" />
          <path d={svgPaths.p26c7f880} fill="black" id="Vector_13" />
          <path d={svgPaths.p2c2f1f00} fill="white" id="Vector_14" />
          <path d={svgPaths.p38f08a00} fill="white" id="Vector_15" />
          <path d={svgPaths.p9183500} fill="white" id="Vector_16" opacity="0.4" />
          <path d={svgPaths.p28629180} fill="white" id="Vector_17" opacity="0.4" />
          <path d={svgPaths.p307adae0} id="Vector_18" stroke="#0F172A" strokeLinecap="round" strokeWidth="0.701817" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="77.1776" id="filter0_d_0_19" width="77.1776" x="-3.49798" y="-1.24928">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="2.2487" />
            <feGaussianBlur stdDeviation="1.74899" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
            <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_0_19" />
            <feBlend in="SourceGraphic" in2="effect1_dropShadow_0_19" mode="normal" result="shape" />
          </filter>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_19" x1="11.0814" x2="20.4428" y1="41.8373" y2="55.2436">
            <stop stopColor="#F3A700" />
            <stop offset="1" stopColor="#F88F01" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_0_19" x1="30.289" x2="56.8841" y1="36.1992" y2="62.7944">
            <stop stopColor="#4AACFD" />
            <stop offset="1" stopColor="#312E81" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_0_19" x1="14.589" x2="23.9505" y1="49.3596" y2="62.7659">
            <stop stopColor="#F3A500" />
            <stop offset="1" stopColor="#F88E01" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function AssetSparkleGrowth() {
  return (
    <div className="absolute flex inset-[2.63%_0_48.59%_81.89%] items-center justify-center" style={{ containerType: "size" }}>
      <div className="-rotate-10 -scale-x-100 flex-none h-[hypot(14.9896cqw,85.0104cqh)] w-[hypot(-85.0104cqw,14.9896cqh)]">
        <div className="relative size-full" data-name="AssetSparkleGrowth">
          <svg className="absolute block inset-0 size-full" fill="none" height="29.5487" preserveAspectRatio="none" viewBox="0 0 29.5487 29.5487" width="29.5487">
            <g filter="url(#filter0_d_0_12)" id="AssetSparkleGrowth">
              <path d={svgPaths.p333e2400} fill="url(#paint0_linear_0_12)" id="Vector" />
              <path d={svgPaths.p35fff80} id="Vector_2" stroke="#FDE047" strokeDasharray="1.18 1.18" strokeLinecap="round" strokeWidth="1.18195" />
              <path d={svgPaths.p33249f80} fill="#FBBF24" id="Vector_3" />
              <path d={svgPaths.pdaadb00} fill="#F97316" id="Vector_4" />
            </g>
            <defs>
              <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="35.0891" id="filter0_d_0_12" width="35.0891" x="-2.77019" y="-1.3851">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset dy="1.3851" />
                <feGaussianBlur stdDeviation="1.3851" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
                <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_0_12" />
                <feBlend in="SourceGraphic" in2="effect1_dropShadow_0_12" mode="normal" result="shape" />
              </filter>
              <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_12" x1="7.38718" x2="22.1615" y1="4.43199" y2="19.2064">
                <stop stopColor="#FBBF24" />
                <stop offset="1" stopColor="#EA580C" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-0">
      <LogoMascot />
      <p className="[word-break:break-word] absolute bg-clip-text bg-gradient-to-b font-['Inter:Bold',sans-serif] font-bold from-[#003ea4] inset-[10.05%_9.17%_4.46%_28.4%] leading-[0] not-italic text-[0px] text-[transparent] to-[#649efd] via-[#5988d6] via-[30.769%] whitespace-nowrap">
        <span className="bg-clip-text bg-gradient-to-r font-['Poppins:Bold',sans-serif] from-[#0965fa] leading-[normal] text-[40.21px] to-[#00b2dd]">RB</span>
        <span className="bg-clip-text bg-gradient-to-r font-['Poppins:Bold',sans-serif] from-[#ff7000] leading-[normal] text-[40.21px] to-[#f1ad00]">ITA</span>
      </p>
      <AssetSparkleGrowth />
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute h-[70.182px] left-[-8px] top-[-6px] w-[189px]" data-name="LOGO">
      <Group />
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[52.8px] relative shrink-0 w-[174.53px]" data-name="Container">
      <Logo />
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex flex-col h-[32.59px] items-start relative shrink-0" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#535353] text-[16px] whitespace-nowrap">
        <p className="leading-[25.6px]">Home</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="h-[31.59px] relative shrink-0 w-[45.91px]" data-name="Link">
      <div aria-hidden className="absolute border-[#535353] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[#535353] text-[16px] top-[12px] whitespace-nowrap">
        <p className="leading-[25.6px]">Profile</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col items-start left-[32px] top-[-1px]" data-name="Link">
      <Link2 />
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="h-[31.59px] relative shrink-0 w-[80.58px]" data-name="Link:margin">
      <Link1 />
    </div>
  );
}

function Link3() {
  return (
    <div className="absolute bottom-0 content-stretch flex flex-col items-start left-[32px] top-[-1px]" data-name="Link">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#535353] text-[16px] whitespace-nowrap">
        <p className="leading-[25.6px]">FAQ</p>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="h-[31.59px] relative shrink-0 w-[62.72px]" data-name="Link:margin">
      <Link3 />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Container">
      <Link />
      <LinkMargin />
      <LinkMargin1 />
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#535353] text-[12px] text-center tracking-[1.2px] whitespace-nowrap">
        <p className="leading-[12px]">Masuk</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f59e0b] content-stretch flex flex-col items-center justify-center px-[24px] py-[8px] relative rounded-[9999px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[28px]">Daftar</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[16px] relative shrink-0" data-name="Button:margin">
      <Button2 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Button1 />
      <ButtonMargin />
    </div>
  );
}

function Container19() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center max-w-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between max-w-[inherit] px-[64px] py-[16px] relative size-full">
          <Container20 />
          <Container21 />
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function TopNavBar() {
  return (
    <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0.6)] content-stretch flex flex-col items-start left-0 pb-px right-0 top-0" data-name="TopNavBar">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <Container19 />
    </div>
  );
}

function Main() {
  return (
    <div className="content-stretch flex flex-col gap-[127px] items-center pb-[160.01px] pt-[223px] relative shrink-0 w-full" data-name="Main">
      <div className="-translate-x-1/2 absolute bg-[rgba(76,215,246,0.1)] blur-[75px] h-[819px] left-[calc(50%-836px)] rounded-[9999px] top-[197px] w-[1024px]" data-name="Ambient Glows" />
      <div className="absolute bg-[rgba(195,192,255,0.1)] blur-[60px] bottom-[40.99%] right-0 rounded-[9999px] top-[40%] w-[640px]" data-name="Overlay+Blur" />
      <Section1Hero />
      <Section2Philosophy />
      <Section3Purpose />
      <Section45VisionSlogan />
      <TopNavBar />
      <div className="-translate-x-1/2 absolute bg-[rgba(76,215,246,0.1)] blur-[75px] h-[819px] left-[calc(50%+804px)] rounded-[9999px] top-[-159px] w-[1024px]" data-name="Ambient Glows" />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#c1c4e6] text-[24px] w-full">
        <p className="leading-[31.2px]">ORBITA</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">2024 ORBITA. All rights reserved.</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-start min-w-px pb-[93.6px] relative" data-name="Container">
      <Heading4 />
      <Container25 />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e0e3e5] text-[12px] tracking-[1.2px] w-full">
        <p className="leading-[12px]">Navigasi</p>
      </div>
    </div>
  );
}

function Item2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">Home</p>
      </div>
    </div>
  );
}

function Item3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c1c4e6] text-[16px] w-full">
        <p className="leading-[25.6px]">Profile</p>
      </div>
    </div>
  );
}

function Item4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">FAQ</p>
      </div>
    </div>
  );
}

function Item5() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">Explore Jurusan</p>
      </div>
    </div>
  );
}

function List1() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-full" data-name="List">
      <Item2 />
      <Item3 />
      <Item4 />
      <Item5 />
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-start min-w-px relative" data-name="Container">
      <Heading5 />
      <List1 />
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e0e3e5] text-[12px] tracking-[1.2px] w-full">
        <p className="leading-[12px]">Akun</p>
      </div>
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="List → Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">Login</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-start min-w-px pb-[112.79px] relative" data-name="Container">
      <Heading6 />
      <ListItem />
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 4">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#e0e3e5] text-[12px] tracking-[1.2px] w-full">
        <p className="leading-[12px]">Kontak</p>
      </div>
    </div>
  );
}

function Item6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">Instagram</p>
      </div>
    </div>
  );
}

function Item7() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[0.59px] relative shrink-0 w-full" data-name="Item">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c7c5ce] text-[16px] w-full">
        <p className="leading-[25.6px]">Email</p>
      </div>
    </div>
  );
}

function List2() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start relative shrink-0 w-full" data-name="List">
      <Item6 />
      <Item7 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-start min-w-px pb-[75.19px] relative" data-name="Container">
      <Heading7 />
      <List2 />
    </div>
  );
}

function Container23() {
  return (
    <div className="max-w-[1280px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-end justify-center max-w-[inherit] size-full">
        <div className="content-stretch flex gap-[24px] items-end justify-center max-w-[inherit] pb-[64px] pt-[63px] px-[64px] relative size-full">
          <Container24 />
          <Container26 />
          <Container27 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-gradient-to-r content-stretch flex flex-col from-[#15234d] items-start relative rounded-tl-[32px] rounded-tr-[32px] shrink-0 to-[#101a33] w-full" data-name="Footer">
      <Container23 />
    </div>
  );
}

export default function OrbitaProfile() {
  return (
    <div className="bg-gradient-to-r content-stretch flex flex-col from-white gap-[96px] items-start relative size-full to-white" data-name="ORBITA - Profile">
      <Main />
      <Footer />
    </div>
  );
}