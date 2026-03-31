namespace Api.Endpoints;

public static class ApiEndpoints
{
    public static WebApplication MapApiEndpoints(this WebApplication app)
    {
        var api = app.MapGroup("/");

        api.MapPessoasEndpoints();
        api.MapCategoriasEndpoints();
        api.MapTransacoesEndpoints();
        api.MapRelatoriosEndpoints();

        return app;
    }
}

