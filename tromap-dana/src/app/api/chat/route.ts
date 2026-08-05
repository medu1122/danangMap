import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// =============================================
// Validation Schema
// =============================================
const NhaTroSchema = z.object({
  id: z.string(),
  tieu_de: z.string(),
  gia_thang: z.number(),
  dien_tich: z.number().optional(),
  dia_chi: z.string().optional(),
  mo_ta: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
});

const ChatRequestSchema = z.object({
  message: z.string()
    .min(1, 'Tin nhắn không được trống')
    .max(500, 'Tin nhắn quá dài (tối đa 500 ký tự)'),
  troList: z.array(NhaTroSchema).max(50, 'Danh sách quá lớn').default([]),
});

// =============================================
// Types
// =============================================
interface NhaTro {
  id: string;
  tieu_de: string;
  gia_thang: number;
  dien_tich?: number;
  dia_chi?: string;
  mo_ta?: string;
  lat: number;
  lng: number;
}

interface ChatResponse {
  message: string;
  suggestions: Pick<NhaTro, 'id' | 'tieu_de' | 'gia_thang' | 'dia_chi' | 'lat' | 'lng'>[];
}

// =============================================
// Response Generator
// =============================================
function generateResponse(message: string, troList: NhaTro[]): ChatResponse {
  const lowerMessage = message.toLowerCase().trim();
  let suggestions: NhaTro[] = [];
  let response = '';

  // Budget-related queries
  if (lowerMessage.includes('giá') || lowerMessage.includes('rẻ') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
    const maxPrice = lowerMessage.includes('1 triệu') ? 1000000 :
                     lowerMessage.includes('2 triệu') ? 2000000 :
                     lowerMessage.includes('3 triệu') ? 3000000 :
                     lowerMessage.includes('5 triệu') ? 5000000 : 2000000;

    suggestions = troList
      .filter(tro => tro.gia_thang <= maxPrice)
      .sort((a, b) => a.gia_thang - b.gia_thang)
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi tìm thấy ${suggestions.length} nhà trọ có giá dưới ${(maxPrice / 1000000).toFixed(0)} triệu/tháng cho bạn:`;
    } else {
      response = 'Rất tiếc, hiện tại chưa có nhà trọ nào trong khoảng giá này. Bạn có muốn tăng ngân sách lên không?';
    }
  }
  // University/location queries
  else if (lowerMessage.includes('bách khoa') || lowerMessage.includes('đhbk') || lowerMessage.includes('bk')) {
    suggestions = troList
      .filter(tro => 
        tro.dia_chi?.toLowerCase().includes('nguyễn văn linh') ||
        tro.dia_chi?.toLowerCase().includes('bách khoa') ||
        tro.tieu_de.toLowerCase().includes('bách khoa')
      )
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi tìm thấy ${suggestions.length} nhà trọ gần ĐH Bách Khoa cho bạn:`;
    } else {
      response = 'Chưa có nhà trọ cụ thể gần ĐH Bách Khoa trong danh sách. Bạn có thể thử khu vực quận Hải Châu, nơi có nhiều trọ cho sinh viên.';
    }
  }
  // Air conditioning
  else if (lowerMessage.includes('máy lạnh') || lowerMessage.includes('điều hòa') || lowerMessage.includes('máy giặt') || lowerMessage.includes('wifi')) {
    suggestions = troList
      .filter(tro => 
        tro.mo_ta?.toLowerCase().includes('máy lạnh') ||
        tro.mo_ta?.toLowerCase().includes('điều hòa') ||
        tro.mo_ta?.toLowerCase().includes('wifi')
      )
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi tìm thấy ${suggestions.length} nhà trọ có tiện nghi bạn yêu cầu:`;
    } else {
      response = 'Chưa tìm thấy nhà trọ có tiện nghi này trong danh sách. Bạn có thể liên hệ trực tiếp chủ trọ để hỏi về các tiện ích có sẵn.';
    }
  }
  // Student queries
  else if (lowerMessage.includes('sinh viên') || lowerMessage.includes('student')) {
    suggestions = troList
      .filter(tro => 
        tro.mo_ta?.toLowerCase().includes('sinh viên') ||
        tro.tieu_de.toLowerCase().includes('sinh viên') ||
        tro.gia_thang <= 3000000
      )
      .sort((a, b) => a.gia_thang - b.gia_thang)
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi gợi ý ${suggestions.length} nhà trọ phù hợp cho sinh viên với giá cả hợp lý:`;
    } else {
      response = 'Chưa có gợi ý cụ thể. Bạn có thể cho tôi biết thêm về ngân sách và khu vực ưa thích?';
    }
  }
  // District queries
  else if (lowerMessage.includes('hải châu') || lowerMessage.includes('thanh khê') || 
           lowerMessage.includes('sơn trà') || lowerMessage.includes('liên chiểu') ||
           lowerMessage.includes('cẩm lệ') || lowerMessage.includes('ngũ hành sơn')) {
    const district = lowerMessage.includes('hải châu') ? 'hải châu' :
                     lowerMessage.includes('thanh khê') ? 'thanh khê' :
                     lowerMessage.includes('sơn trà') ? 'sơn trà' :
                     lowerMessage.includes('liên chiểu') ? 'liên chiểu' :
                     lowerMessage.includes('cẩm lệ') ? 'cẩm lệ' : 'ngũ hành sơn';

    suggestions = troList
      .filter(tro => tro.dia_chi?.toLowerCase().includes(district))
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi tìm thấy ${suggestions.length} nhà trọ ở quận ${district.charAt(0).toUpperCase() + district.slice(1)}:`;
    } else {
      response = `Chưa có nhà trọ cụ thể ở quận ${district.charAt(0).toUpperCase() + district.slice(1)}. Bạn có thể thử các quận lân cận hoặc tăng phạm vi tìm kiếm.`;
    }
  }
  // Area/size queries
  else if (lowerMessage.includes('diện tích') || lowerMessage.includes('rộng') || lowerMessage.includes('lớn')) {
    const minArea = lowerMessage.includes('30') ? 30 :
                    lowerMessage.includes('25') ? 25 :
                    lowerMessage.includes('20') ? 20 : 25;

    suggestions = troList
      .filter(tro => tro.dien_tich && tro.dien_tich >= minArea)
      .sort((a, b) => (b.dien_tich || 0) - (a.dien_tich || 0))
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi tìm thấy ${suggestions.length} nhà trọ có diện tích từ ${minArea}m² trở lên:`;
    } else {
      response = `Chưa tìm thấy nhà trọ có diện tích từ ${minArea}m² trở lên. Bạn có muốn xem các lựa chọn khác?`;
    }
  }
  // Price comparison
  else if (lowerMessage.includes('đắt') || lowerMessage.includes('cao cấp') || lowerMessage.includes('xịn')) {
    suggestions = troList
      .filter(tro => tro.gia_thang >= 5000000)
      .sort((a, b) => b.gia_thang - a.gia_thang)
      .slice(0, 5);

    if (suggestions.length > 0) {
      response = `Tôi gợi ý ${suggestions.length} nhà trọ cao cấp cho bạn:`;
    } else {
      response = 'Chưa có nhà trọ cao cấp trong danh sách hiện tại.';
    }
  }
  // Default response
  else {
    // Return top rated (by views if available) or newest
    suggestions = [...troList]
      .sort((a, b) => new Date(b.ngay_tao || 0).getTime() - new Date(a.ngay_tao || 0).getTime())
      .slice(0, 3);

    response = `Tôi có ${troList.length} nhà trọ trong danh sách. Bạn có thể hỏi về:

• Giá cả (VD: "trọ dưới 2 triệu")
• Khu vực (VD: "trọ quận Hải Châu")
• Trường học (VD: "trọ gần ĐH Bách Khoa")
• Tiện nghi (VD: "trọ có máy lạnh")
• Dành cho sinh viên`;
  }

  return { message: response, suggestions };
}

// =============================================
// API Handler
// =============================================
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const parseResult = ChatRequestSchema.safeParse(body);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request',
          details: parseResult.error.issues.map(i => ({
            field: i.path.join('.'),
            message: i.message
          }))
        },
        { status: 400 }
      );
    }

    const { message, troList } = parseResult.data;

    // Optional: Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      // TODO: Implement OpenAI integration
      // For now, fall back to keyword matching
      console.log('OpenAI API key found, but integration not implemented yet');
    }

    // Generate response using keyword matching
    const result = generateResponse(message, troList);

    return NextResponse.json({
      message: result.message,
      suggestions: result.suggestions.map(tro => ({
        id: tro.id,
        tieu_de: tro.tieu_de,
        gia_thang: tro.gia_thang,
        dia_chi: tro.dia_chi,
        lat: tro.lat,
        lng: tro.lng,
      })),
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
