import { NextResponse, NextRequest } from "next/server";
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";
import { normalizePersonaPage } from "@/lib/personas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const personaId = url.searchParams.get('id');
      const page = url.searchParams.get('page');

      if (personaId == null) {
        return new NextResponse(JSON.stringify({ error: 'Missing parameter id' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      const pageNumber = normalizePersonaPage(page == null ? 0 : Number(page));
      const personaInfo = await (await sunoApi()).getPersonaPaginated(personaId, pageNumber);

      return new NextResponse(JSON.stringify(personaInfo), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error: any) {
      console.error('Error fetching persona:', error);

      const isValidationError = error.message === 'page must be a non-negative integer';
      return new NextResponse(JSON.stringify({ error: isValidationError ? error.message : 'Internal server error' }), {
        status: isValidationError ? 400 : 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      headers: {
        Allow: 'GET',
        ...corsHeaders
      },
      status: 405
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
